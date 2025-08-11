package com.example.oj.api;

import com.example.oj.constant.Constant;
import com.example.oj.constant.Utils;
import com.example.oj.document.ProblemDocument;
import com.example.oj.document.UserDocument;
import com.example.oj.service.ProblemService;
import com.example.oj.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.bcel.Const;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.tree.DefaultTreeCellEditor;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/v1/file")
@RequiredArgsConstructor
public class HandlerFileAPI {
    private final ProblemService problemService;
    private final Utils utils;
    private final UserService userService;
    @PostMapping("/upload-file")
    public ResponseEntity<List<String>> uploadFile(@RequestParam("files")List<MultipartFile> files, @RequestParam String folder, @RequestParam String type) throws IOException {
        Path dir = Paths.get("./testcase", folder);
        if(Files.exists(dir)) {
            Path input = Paths.get("./testcase", folder, "input");
            Path output = Paths.get("./testcase", folder, "output");
            if(Files.exists(input) && Files.exists(output))
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<String> filesResponse = new ArrayList<>();
        for (MultipartFile file : files) {
            byte[] bytes = file.getBytes();
            String filename = file.getOriginalFilename();
            Path directory = Paths.get("./testcase", folder, type);
            Files.createDirectories(directory);
            Path filePath = directory.resolve(filename);
            Files.write(filePath, bytes);
            filesResponse.add(filePath.toString());
        }
        Collections.sort(filesResponse);
        return ResponseEntity.ok(filesResponse);
    }

    @DeleteMapping("/delete-folder/{folder}")
    public ResponseEntity<Map<String, String>> deleteFile(@RequestHeader("Authorization") String header, @PathVariable String folder) {
        String email = utils.getEmailFromToken(header);
        if(email != null) {
            Optional<UserDocument> userDocument = userService.findUser(email);
            if(userDocument.isPresent()) {
                Map<String, String> mp = new HashMap<>();
                if(!userDocument.get().getRole().getCode().equals("STUDENT")) {
                    String folderPath = "./testcase/" + folder;
                    Path directory = Paths.get(folderPath);
                    try {
                        if(Files.exists(directory)) {
                            Files.walk(directory)
                                    .sorted(Comparator.reverseOrder())
                                    .map(Path::toFile)
                                    .forEach(File::delete);
                        }
                        mp.put("result", "success");
                        return ResponseEntity.ok(mp);
                    } catch (IOException e) {
                        mp.put("result", "NOT FOUND");
                        return ResponseEntity.ok(mp);
                    }
                }
                else {
                    mp.put("result", "error");
                    return ResponseEntity.ok(mp);
                }
            }
        }
        return ResponseEntity.status(403).build();
    }

    @GetMapping("/get-folders")
    public ResponseEntity<List<Map<String, Object>>> getFolder() {
        Path testcase = Paths.get("data" + File.separator + "testcase");
        List<Map<String, Object>> foldersInfo = new ArrayList<>();

        try (Stream<Path> paths = Files.walk(testcase, 1)) {
            List<Path> folders = paths
                    .filter(Files::isDirectory) // Chỉ lấy các thư mục
                    .filter(path -> !path.equals(testcase)) // Bỏ qua thư mục gốc
                    .collect(Collectors.toList());

            for (Path folder : folders) {
                Map<String, Object> folderInfo = new HashMap<>();
                folderInfo.put("name", folder.getFileName().toString());
                folderInfo.put("path", folder.toString());

                // Kiểm tra thư mục input và output
                Path inputFolder = folder.resolve("input");
                Path outputFolder = folder.resolve("output");

                int inputFileCount = countFilesInDirectory(inputFolder);
                int outputFileCount = countFilesInDirectory(outputFolder);

                folderInfo.put("inputFileCount", inputFileCount);
                folderInfo.put("outputFileCount", outputFileCount);

                foldersInfo.add(folderInfo);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }

        return ResponseEntity.ok(problemService.handleTestcase(foldersInfo));
    }

    private int countFilesInDirectory(Path directory) {
        if (Files.exists(directory) && Files.isDirectory(directory)) {
            try (Stream<Path> files = Files.walk(directory)) {
                return (int) files
                        .filter(Files::isRegularFile)
                        .count();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return 0;
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() throws IOException {
        File file = new File("./testcase/check-prime-numbers/input/1.in");
        if(file.exists()) {
            BufferedReader bufferedReader = new BufferedReader(new FileReader(file));
            String line;
            StringBuilder stringBuilder = new StringBuilder();
            while ((line = bufferedReader.readLine()) != null) {
                stringBuilder.append(line);
            }
            Map<String, Object> mp = new HashMap<>();
            mp.put("test", stringBuilder.toString());
            return mp != null ? ResponseEntity.ok(mp) : ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
