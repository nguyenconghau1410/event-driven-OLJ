package com.example.oj.constant;

import com.example.oj.dto.Execute;
import com.example.oj.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

@RequiredArgsConstructor
@Component
public class Utils {
    private final JwtService jwtService;

    public String getEmailFromToken(String accessToken) {
        if(accessToken != null || accessToken.startsWith("Bearer ")) {
            return jwtService.extractUsername(accessToken.substring(7));
        }
        return null;
    }


    public double calculateExecuteTime(long startTime, long endTime) {
        long executionTimeNano = endTime - startTime;
        double executionTimeSeconds = (double) executionTimeNano / 1_000_000_000.0;
        return executionTimeSeconds;
    }

    public String checkResult(String outputTestcase, String outputJudge) {
        if(outputTestcase.equals(outputJudge)) {
            return "ACCEPTED";
        }
        return "WRONG ANSWER";
    }


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

    public String handleTestResult(File file) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new FileReader(file));
        StringBuilder output = new StringBuilder();
        String line;
        while ((line = bufferedReader.readLine()) != null) {
            output.append(line);
        }
        return output.toString().trim();
    }

    public String handleCompilerError(Process process) throws IOException {
        StringBuilder error = new StringBuilder();
        BufferedReader errorReader = new BufferedReader(process.errorReader());
        String line;
        while ((line = errorReader.readLine()) != null) {
            error.append(line);
        }
        return error.toString().trim();
    }

    public Float calculateScore(int rightTest, int totalTest, float maxScored) {
        float scored = ((float)rightTest / totalTest) * maxScored;
        return scored;
    }

    public Execute executeJudgeCode(Map<String, String> test, double timeLimit, Runtime runtime, String language) throws IOException {
        ProcessBuilder builder;
        long delayMillis;
        if(language.equals("java")) {
            builder = new ProcessBuilder("java", "-cp", ".", "Main");
            delayMillis = (long) (timeLimit * 1000) * 2;
        }
        else if(language.equals("python")) {
            builder= new ProcessBuilder("python3", "main.py");
            delayMillis = (long) (timeLimit * 1000) * 4;
        }
        else {
            builder = new ProcessBuilder("./a.exe");
            delayMillis = (long) (timeLimit * 1000);
        }
        File inputFile = new File(Constant.handlePath(test.get("input")));
        builder.redirectInput(inputFile);
        ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);
        Callable<Execute> task = () -> {
            Process process;
            long startTime;
            try {
                startTime = System.nanoTime();
                process = builder.start();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            BufferedReader inputReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            try {
                while ((line = inputReader.readLine()) != null) {
                    output.append(line);
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            String error;
            try {
                error = handleCompilerError(process);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            process.destroy();

            long endTime = System.nanoTime();
            double executeTime = calculateExecuteTime(startTime, endTime);
            long memoryUsedBytes = runtime.totalMemory() - runtime.freeMemory();
            double memoryMB = (double) memoryUsedBytes / (1024 * 1024);

            Execute execute = new Execute();
            execute.setOutput(output.toString().trim());
            execute.setTime(executeTime);
            execute.setMemory(memoryMB);
            if (!error.equals("")) {
                execute.setResult("RUNTIME ERROR");
                execute.setCompilerReport(error);
            }
            return execute;
        };
        ScheduledFuture<Execute> future = executorService.schedule(task, 0, TimeUnit.MILLISECONDS);
        Execute execute = null;
        try {
            execute = future.get(delayMillis, TimeUnit.MILLISECONDS);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            execute = new Execute();
            execute.setResult("TIME LIMIT EXCEEDED");
            future.cancel(true);
        }
        executorService.shutdown();
        return execute;
    }

}
