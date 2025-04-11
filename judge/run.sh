#!/bin/bash

CGROUP_NAME=$1
TIME_LIMIT=$2
MEMORY_LIMIT=$3
TEST_CASES=$4
CGROUP_MEMORY=$5
EXE_FILE=$6
CURRENT_BOX_ID=0

IFS=';' read -r -a cases_array <<< "$TEST_CASES"

if [ ! -d "/sys/fs/cgroup/memory/$CGROUP_NAME" ]; then
  sudo cgcreate -g memory,cpu:/$CGROUP_NAME
fi

initialize_isolate() {
  existing_boxes=$(ls /var/local/lib/isolate/ 2>/dev/null | grep -E '^[0-9]+$' | sort -n)
  if [[ -z "$existing_boxes" ]]; then
      new_box_id=1
  else
      new_box_id=$(( $(echo "$existing_boxes" | tail -n 1) + 1 ))
  fi
  sudo isolate --init --box-id=$new_box_id
  CURRENT_BOX_ID=$new_box_id
  sudo cp "$EXE_FILE" "/var/local/lib/isolate/$CURRENT_BOX_ID/box/"
}

set_limits() {
  sudo cgset -r cpu.max="25000 100000" $CGROUP_NAME
  sudo cgset -r memory.max=$CGROUP_MEMORY $CGROUP_NAME
}

cleanup_isolate() {
  sudo isolate --cleanup --box-id=$CURRENT_BOX_ID
}

clean_cgroup() {
  sudo cgdelete -g memory,cpu:/$CGROUP_NAME
}

run_test_case() {
  results="["
  for case in "${cases_array[@]}"; do
    read -r input output <<< "$case"

    input_file="/box/$(basename "$input")"

    set_limits
    initialize_isolate

    cp "$input" "/var/local/lib/isolate/$CURRENT_BOX_ID/box/"

    sudo cgexec -g memory,cpu:/$CGROUP_NAME isolate --box-id=$CURRENT_BOX_ID --time=$TIME_LIMIT --mem=$MEMORY_LIMIT --meta=meta.txt --stdin=$input_file --stdout=/box/expected.txt --run -- /box/$EXE_FILE

    exec_time=$(grep 'time:' meta.txt | cut -d ' ' -f2)
    max_mem=$(grep 'max-rss:' meta.txt | cut -d ' ' -f2)
    status=$(grep 'status:' meta.txt | cut -d ' ' -f2)

    if [[ "$status" == "TO" ]]; then
      result="TLE"  # Time Limit Exceeded
    elif [[ "$status" == "RE" ]]; then
      result="RTE"  # Runtime Error
    elif [[ "$max_mem" -gt "$MEMORY_LIMIT" ]]; then
      result="MLE"  # Memory Limit Exceeded
    elif diff <(sed 's/^[[:space:]]*//;s/[[:space:]]*$//' "/var/local/lib/isolate/$CURRENT_BOX_ID/box/expected.txt") <(sed 's/^[[:space:]]*//;s/[[:space:]]*$//' "$output") >/dev/null; then
      result="AC"  # Accepted
    else
      result="WA"  # Wrong Answer
    fi

    results+="{\"input\":\"$input\", \"expected\":\"$output\", \"result\":\"$result\", \"time\":\"$exec_time\", \"memory\":\"$max_mem\"},"

    cleanup_isolate
  done

  results="${results%,}]"
  echo "$results" > results.json
  clean_cgroup
}

run_test_case