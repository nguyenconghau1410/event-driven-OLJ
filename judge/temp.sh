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
   cgcreate -g memory,cpu:/$CGROUP_NAME
fi

initialize_isolate() {
  existing_boxes=$(ls /var/local/lib/isolate/ 2>/dev/null | grep -E '^[0-9]+$' | sort -n)
  if [[ -z "$existing_boxes" ]]; then
      new_box_id=1
  else
      new_box_id=$(( $(echo "$existing_boxes" | tail -n 1) + 1 ))
  fi
   isolate --init --box-id=$new_box_id
  CURRENT_BOX_ID=$new_box_id
   cp "$EXE_FILE" "/var/local/lib/isolate/$CURRENT_BOX_ID/box/"
}

detect_cgroup_version() {
    if [ -f "/sys/fs/cgroup/cgroup.controllers" ]; then
        echo "cgroup v2 detected"
        return 2
    else
        echo "cgroup v1 detected"
        return 1
    fi
}

set_limits() {
   detect_cgroup_version
   CGROUP_VERSION=$?
   if [ "$CGROUP_VERSION" -eq 2 ]; then
        cgset -r cpu.max="${CPU_QUOTA} ${CPU_PERIOD}" $CGROUP_NAME
        cgset -r memory.max=$CGROUP_MEMORY $CGROUP_NAME
        echo "Applied cgroup v2 limits"
   elif [ "$CGROUP_VERSION" -eq 1 ]; then
        cgset -r cpu.cfs_period_us=100000 $CGROUP_NAME
        cgset -r cpu.cfs_quota_us=25000 $CGROUP_NAME
        cgset -r memory.limit_in_bytes=$CGROUP_MEMORY $CGROUP_NAME
        echo "Applied cgroup v1 limits"
   else
        echo "Unknown cgroup version!"
        exit 1
   fi
}

cleanup_isolate() {
   isolate --cleanup --box-id=$CURRENT_BOX_ID
}

clean_cgroup() {
   cgdelete -g memory,cpu:/$CGROUP_NAME
}

run_test_case() {
  results="["
  for case in "${cases_array[@]}"; do
    read -r input output <<< "$case"

    input_file="/box/$(basename "$input")"

    set_limits
    initialize_isolate

    cp "$input" "/var/local/lib/isolate/$CURRENT_BOX_ID/box/"

    cgexec -g memory,cpu:/$CGROUP_NAME isolate --box-id=$CURRENT_BOX_ID --time=$TIME_LIMIT --mem=$MEMORY_LIMIT --meta=meta.txt --stdin=$input_file --stdout=/box/expected.txt --run -- /box/$EXE_FILE

    exec_time=$(grep 'time:' meta.txt | awk -F':' '{print $2}' | xargs)
    max_mem=$(grep 'max-rss:' meta.txt | awk -F':' '{print $2}' | xargs)
    status=$(grep 'status:' meta.txt | awk -F':' '{print $2}' | xargs)


    if [[ "$status" == "TO" ]]; then
      result="TLE"  # Time Limit Exceeded
    elif [[ "$status" == "RE" ]]; then
      result="RTE"  # Runtime Error
    elif [[ "$max_mem" -gt "$MEMORY_LIMIT" ]]; then
      result="MLE"  # Memory Limit Exceeded
    elif diff -q <(awk '{$1=$1}1' "/var/local/lib/isolate/$CURRENT_BOX_ID/box/expected.txt" | grep -v '^$' | tr -d '\r') \
            <(awk '{$1=$1}1' "$output" | grep -v '^$' | tr -d '\r') >/dev/null; then
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