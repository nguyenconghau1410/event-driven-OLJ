package com.example.judge.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import com.example.judge.model.Execute;
import java.io.*;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.*;

@RequiredArgsConstructor
@Component
public class Utils {
    public String checkFinalResult(List<String> outputs) {
        Map<String, Integer> mp = new HashMap<>();
        for (String output: outputs) {
            if(output.equals("WRONG ANSWER")) {
                if(mp.get("WRONG ANSWER") == null) {
                    mp.put("WRONG ANSWER", 1);
                }
                else {
                    int temp = mp.get("WRONG ANSWER");
                    mp.put("WRONG ANSWER", temp + 1);
                }
            }
            else if(output.equals("TIME LIMIT EXCEEDED")) {
                if(mp.get("TIME LIMIT EXCEEDED") == null) {
                    mp.put("TIME LIMIT EXCEEDED", 1);
                }
                else {
                    int temp = mp.get("TIME LIMIT EXCEEDED");
                    mp.put("TIME LIMIT EXCEEDED", temp + 1);
                }
            }
            else if(output.equals("RUNTIME ERROR")) {
                if(mp.get("RUNTIME ERROR") == null) {
                    mp.put("RUNTIME ERROR", 1);
                }
                else {
                    int temp = mp.get("RUNTIME ERROR");
                    mp.put("RUNTIME ERROR", temp + 1);
                }
            }
            else if(output.equals("MEMORY LIMIT EXCEEDED")) {
                if(mp.get("MEMORY LIMIT EXCEEDED") == null) {
                    mp.put("MEMORY LIMIT EXCEEDED", 1);
                }
                else {
                    int temp = mp.get("MEMORY LIMIT EXCEEDED");
                    mp.put("MEMORY LIMIT EXCEEDED", temp + 1);
                }
            }
            else if(output.equals("ACCEPTED")) {
                if(mp.get("ACCEPTED") == null) {
                    mp.put("ACCEPTED", 1);
                }
                else {
                    int temp = mp.get("ACCEPTED");
                    mp.put("ACCEPTED", temp + 1);
                }
            }
            else {
                if(mp.get("ERROR") == null) {
                    mp.put("ERROR", 1);
                }
                else {
                    int temp = mp.get("ERROR");
                    mp.put("ERROR", temp + 1);
                }
            }
        }
        String tmp = "";
        int cnt = 0;
        for (Map.Entry<String, Integer> entry : mp.entrySet()) {
            if(entry.getValue() > 0) {
                cnt = entry.getValue();
                tmp = entry.getKey();
            }
        }
        return tmp;
    }

    public Float calculateScore(int rightTest, int totalTest, float maxScored) {
        float scored = ((float)rightTest / totalTest) * maxScored;
        return scored;
    }

    public String convertString(String result) {
        if(result == null) return "ERROR";
        String expected = "";
        if(result.equals("AC")) expected = "ACCEPTED";
        else if(result.equals("TLE")) expected = "TIME LIMIT EXCEEDED";
        else if(result.equals("WA")) expected = "WRONG ANSWER";
        else if(result.equals("RTE")) expected = "RUNTIME ERROR";
        else if(result.equals("MLE")) expected = "MEMORY LIMIT EXCEEDED";
        return expected;
    }

    public List<Execute> createSandbox(String testcases, Double timeLimit, String memoryLimit, String language, String nameFile) throws IOException, InterruptedException {
        String cgroupName = nameFile;
        if(language.equals("java")) {
            nameFile += ".class";
            timeLimit = timeLimit * 4;
        }
        else if(language.equals("python")) {
            nameFile += ".py";
            timeLimit = timeLimit * 8;
        }
        else if(language.equals("php")) {
            nameFile += ".php";
            timeLimit = timeLimit * 8;
        }
        else {
            nameFile += ".exe";
        }
        String scriptPath = "./judge.sh";
        Long memoryBytes = Long.parseLong(memoryLimit) * 1024;
        String command[] = {
                scriptPath, cgroupName, timeLimit.toString(), memoryBytes.toString(),
                testcases,
                memoryLimit + "M", nameFile, language
        };

        Process process = new ProcessBuilder(command).start();
        int exitCode = process.waitFor();
        if (exitCode == 0) {
            System.out.println("The script " + cgroupName + " run successfully");
        } else {
            System.out.println("An occurred error: " + exitCode);
        }

        Path folderPath = Paths.get(cgroupName + "-RESULT");
        if(Files.exists(folderPath) && Files.isDirectory(folderPath)) {
            Path filePath = Paths.get(cgroupName + "-RESULT", "results.json");
            try {
                List<Execute> executes = new ArrayList<>();
                ObjectMapper objectMapper = new ObjectMapper();
                List<Map<String, Object>> resultList = objectMapper.readValue(Files.readString(filePath), List.class);
                for(Map<String, Object> mp : resultList) {
                    Execute execute = new Execute();
                    execute.setTime(Double.parseDouble((String) mp.get("time")));
                    execute.setMemory(Double.parseDouble((String) mp.get("memory")) / 1024);
                    execute.setResult(convertString((String) mp.get("result")));
                    executes.add(execute);
                }
                Files.walkFileTree(folderPath, new SimpleFileVisitor<Path>() {
                    @Override
                    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                        Files.delete(file);
                        return FileVisitResult.CONTINUE;
                    }

                    @Override
                    public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                        Files.delete(dir);
                        return FileVisitResult.CONTINUE;
                    }
                });
                return executes;
            } catch (Exception e) {
                System.err.println("Error reading file: " + e.getMessage());
            }
        }
        else {
            System.err.println("File not exist!");
        }

        return null;
    }
}
