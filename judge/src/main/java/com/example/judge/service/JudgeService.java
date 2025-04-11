package com.example.judge.service;

import com.example.judge.constants.Constant;
import com.example.judge.model.*;
import com.example.judge.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JudgeService {
    private final Utils utils;
    public SubmissionDocument compileAndExecute(SubmissionDocument submissionDocument, Problem problemDocument) throws IOException, InterruptedException {
        String nameFile = submissionDocument.getId();
        String name = nameFile;
        File file = null;
        String language = submissionDocument.getLanguage();
        if(language.equals("java")) {
            nameFile = "Main" + nameFile;
            name = nameFile;
            String source = submissionDocument.getSource().replace("public class Main", "public class " + nameFile);
            nameFile += ".java";
            file = new File(nameFile);
            FileWriter writer = new FileWriter(file);
            writer.write(source);
            writer.close();

            ProcessBuilder processBuilder = new ProcessBuilder("javac", nameFile);
            Process process = processBuilder.start();
            process.waitFor();

            if(process.exitValue() != 0) {
                submissionDocument.setResult("COMPILATION ERROR");
            }
//            JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
//            int compilationResult = compiler.run(null, null, null, file.getPath());
//            if(compilationResult != 0) {
//                submissionDocument.setResult("COMPILATION ERROR");
//            }
        }
        else if(language.equals("python") || language.equals("php")) {
            if(language.equals("python"))
                nameFile += ".py";
            else
                nameFile += ".php";
            file = new File(nameFile);
            FileWriter writer = new FileWriter(file);
            writer.write(submissionDocument.getSource());
            writer.close();
        }
        else if(language.equals("cpp") || language.equals("c")) {
            String compiler;
            if(language.equals("cpp")) {
                nameFile += ".cpp";
                compiler = "g++";
            }
            else {
                nameFile += ".c";
                compiler = "gcc";
            }
            file = new File(nameFile);
            FileWriter writer = new FileWriter(file);
            writer.write(submissionDocument.getSource());
            writer.close();

            String executeFile = name + ".exe";
            ProcessBuilder processBuilder = new ProcessBuilder(compiler, nameFile, "-o", executeFile);
            Process process = processBuilder.start();
            process.waitFor();

            if(process.exitValue() != 0) {
                submissionDocument.setResult("COMPILATION ERROR");
            }
        }

        if(submissionDocument.getResult() != null) {
            return submissionDocument;
        }

        String testcases = "";
        for(int i = 0; i < problemDocument.getTestcase().size(); i++) {
            Map<String, String> testcase = problemDocument.getTestcase().get(i);

            String input = Constant.handlePath(testcase.get("input"));
            String output = Constant.handlePath(testcase.get("output"));
            String temp = input.replaceFirst("./", "data/") + " "
                    + output.replaceFirst("./", "data/");

            testcases += temp;
            if(i != problemDocument.getTestcase().size() - 1) testcases += ";";
        }

        List<Execute> executes = utils.createSandbox(testcases, Double.parseDouble(problemDocument.getTimeLimit()),
                problemDocument.getMemoryLimit(), submissionDocument.getLanguage(),
                name);

        if(executes != null) {
            List<ResultTestCase> rtcs = new ArrayList<>();
            List<String> outputs = new ArrayList<>();
            Float maxTime = 0f;
            Float memory = 0f;
            int rightTest = 0;
            for(Execute execute : executes) {
                ResultTestCase resultTestCase = new ResultTestCase();
                resultTestCase.setMemory(execute.getMemory());
                resultTestCase.setTime(execute.getTime());
                resultTestCase.setResult(execute.getResult());
                rtcs.add(resultTestCase);
                outputs.add(execute.getResult());
                maxTime = (float) Math.max(maxTime, execute.getTime());
                memory = (float) Math.max(memory, execute.getMemory());
                if(execute.getResult().equals("ACCEPTED")) rightTest++;
            }
            submissionDocument.setTestcases(rtcs);
            submissionDocument.setResult(utils.checkFinalResult(outputs));
            submissionDocument.setTime(maxTime);
            submissionDocument.setMemory(memory);
            submissionDocument.setRightTest(rightTest);
        }

        file.delete();
        if(submissionDocument.getLanguage().equals("java")) {
            File fileExecute = new File(name + ".class");
            fileExecute.delete();
        }
        else if(submissionDocument.getLanguage().equals("cpp") || submissionDocument.getLanguage().equals("c")) {
            File fileExecute = new File(name + ".exe");
            fileExecute.delete();
        }
        return submissionDocument;
    }

    public DetailResult compileAndExecute(DetailResult submissionDocument, Problem problemDocument) throws IOException, InterruptedException {
        String nameFile = submissionDocument.getId();
        String name = nameFile;
        File file = null;
        String language = submissionDocument.getLanguage();
        if(language.equals("java")) {
            nameFile = "Main" + nameFile;
            name = nameFile;
            String source = submissionDocument.getSource().replace("public class Main", "public class " + nameFile);
            nameFile += ".java";
            file = new File(nameFile);
            FileWriter writer = new FileWriter(file);
            writer.write(source);
            writer.close();

            ProcessBuilder processBuilder = new ProcessBuilder("javac", nameFile);
            Process process = processBuilder.start();
            process.waitFor();

            if(process.exitValue() != 0) {
                submissionDocument.setResult("COMPILATION ERROR");
            }
//            JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
//            int compilationResult = compiler.run(null, null, null, file.getPath());
//            if(compilationResult != 0) {
//                submissionDocument.setResult("COMPILATION ERROR");
//            }
        }
        else if(language.equals("python") || language.equals("php")) {
            if(language.equals("python"))
                nameFile += ".py";
            else
                nameFile += ".php";
            file = new File(nameFile);
            FileWriter writer = new FileWriter(file);
            writer.write(submissionDocument.getSource());
            writer.close();
        }
        else if(language.equals("cpp") || language.equals("c")) {
            String compiler;
            if(language.equals("cpp")) {
                nameFile += ".cpp";
                compiler = "g++";
            }
            else {
                nameFile += ".c";
                compiler = "gcc";
            }
            file = new File(nameFile);
            FileWriter writer = new FileWriter(file);
            writer.write(submissionDocument.getSource());
            writer.close();

            String executeFile = name + ".exe";
            ProcessBuilder processBuilder = new ProcessBuilder(compiler, nameFile, "-o", executeFile);
            Process process = processBuilder.start();
            process.waitFor();

            if(process.exitValue() != 0) {
                submissionDocument.setResult("COMPILATION ERROR");
            }
        }

        if(submissionDocument.getResult() != null) {
            return submissionDocument;
        }

        String testcases = "";
        for(int i = 0; i < problemDocument.getTestcase().size(); i++) {
            Map<String, String> testcase = problemDocument.getTestcase().get(i);

            String input = Constant.handlePath(testcase.get("input"));
            String output = Constant.handlePath(testcase.get("output"));
            String temp = input.replaceFirst("./", "data/") + " "
                    + output.replaceFirst("./", "data/");

            testcases += temp;
            if(i != problemDocument.getTestcase().size() - 1) testcases += ";";
        }

        List<Execute> executes = utils.createSandbox(testcases, Double.parseDouble(problemDocument.getTimeLimit()),
                problemDocument.getMemoryLimit(), submissionDocument.getLanguage(),
                name);

        if(executes != null) {
            List<ResultTestCase> rtcs = new ArrayList<>();
            List<String> outputs = new ArrayList<>();
            Float maxTime = 0f;
            Float memory = 0f;
            int rightTest = 0;
            for(Execute execute : executes) {
                ResultTestCase resultTestCase = new ResultTestCase();
                resultTestCase.setMemory(execute.getMemory());
                resultTestCase.setTime(execute.getTime());
                resultTestCase.setResult(execute.getResult());
                rtcs.add(resultTestCase);
                outputs.add(execute.getResult());
                maxTime = (float) Math.max(maxTime, execute.getTime());
                memory = (float) Math.max(memory, execute.getMemory());
                if(execute.getResult().equals("ACCEPTED")) rightTest++;
            }
            submissionDocument.setTestcases(rtcs);
            submissionDocument.setResult(utils.checkFinalResult(outputs));
            submissionDocument.setTime(maxTime);
            submissionDocument.setMemory(memory);
            submissionDocument.setRightTest(rightTest);
            submissionDocument.setPoint(1f * rightTest * 100 / submissionDocument.getTotalTest());
        }

        file.delete();
        if(submissionDocument.getLanguage().equals("java")) {
            File fileExecute = new File(name + ".class");
            fileExecute.delete();
        }
        else if(submissionDocument.getLanguage().equals("cpp") || submissionDocument.getLanguage().equals("c")) {
            File fileExecute = new File(name + ".exe");
            fileExecute.delete();
        }
        return submissionDocument;
    }
}
