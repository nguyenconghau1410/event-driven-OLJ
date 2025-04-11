package com.example.oj.api;

import com.example.oj.constant.Utils;
import com.example.oj.document.UserDocument;
import com.example.oj.producer.MessageProducer;
import com.example.oj.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserAPI {
    private final UserService userService;
    private final Utils utils;
    private final MessageProducer messageProducer;

//    @GetMapping("/test")
//    public void cc() {
//        messageProducer.sendMessageAndReceiveResponse("cccccc");
//    }
    @GetMapping("/get")
    public ResponseEntity<Object> getUser(@RequestHeader("Authorization") String authorizationHeader) {
        String email = utils.getEmailFromToken(authorizationHeader);
        if(email != null) {
            UserDocument userDocument = userService.findOneByEmail(email);
            return ResponseEntity.ok(userDocument);
        }
        return null;
    }

    @PutMapping("/update")
    public void updateUser(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, String> data) {
        String email = utils.getEmailFromToken(authorizationHeader);
        if(email != null) {
            userService.updateUser(email, data);
        }
    }

    @GetMapping("/get-by-email/{email}")
    public ResponseEntity<UserDocument> getUserEmail(@PathVariable String email) {
        Optional<UserDocument> userDocument = userService.findUser(email);
        if(userDocument.isPresent()) {
            return ResponseEntity.ok(userDocument.get());
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<UserDocument> getUserById(@PathVariable String id) {
        Optional<UserDocument> userDocumentOptional = userService.findUserById(id);
        if(userDocumentOptional.isPresent()) {
            return ResponseEntity.ok(userDocumentOptional.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/get-info-user/{id}")
    public ResponseEntity<Map<String, Object>> getInfoUser(@PathVariable String id) {
        Map<String, Object> mp = userService.getInfoUser(id);
        if(mp == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(mp);
    }

    // administration
    @GetMapping("/admin/get-all/{pageNumber}")
    public ResponseEntity<List<UserDocument>> getUsers(@PathVariable int pageNumber) {
        return ResponseEntity.ok(userService.getUsers(pageNumber));
    }

    @GetMapping("/admin/count-all")
    public ResponseEntity<Map<String, Long>> countUsers() {
        Map<String, Long> mp = new HashMap<>();
        mp.put("total", userService.countUsers());
        return ResponseEntity.ok(mp);
    }

    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String id) {
        String email = utils.getEmailFromToken(authorizationHeader);
        return ResponseEntity.ok(userService.deleteUser(email, id));
    }

    @PutMapping("/admin/exchange-role")
    public ResponseEntity<Map<String, String>> exchangeRole(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, String> data) {
        String email = utils.getEmailFromToken(authorizationHeader);
        Map<String, String> mp = userService.exchangeRole(email, data);
        return mp != null ? ResponseEntity.ok(mp) : ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @GetMapping("/admin/search/{keyword}/{pageNumber}")
    public ResponseEntity<Map<String, Object>> search(@PathVariable String keyword, @PathVariable int pageNumber) {
        Map<String, Object> data = userService.findByNameContaining(keyword, pageNumber);
        return data != null ? ResponseEntity.ok(data) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
