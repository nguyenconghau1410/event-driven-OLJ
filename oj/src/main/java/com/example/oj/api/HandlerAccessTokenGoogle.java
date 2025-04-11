package com.example.oj.api;

import com.example.oj.constant.Constant;
import com.example.oj.document.UserDocument;
import com.example.oj.dto.AccessToken;
import com.example.oj.dto.Token;
import com.example.oj.security.JwtService;
import com.example.oj.service.CustomUserDetailService;
import com.example.oj.service.RoleService;
import com.example.oj.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.InvalidClassException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class HandlerAccessTokenGoogle {
    private final JwtService jwtService;
    private final CustomUserDetailService userDetailService;
    private final UserService userService;
    private final RoleService roleService;

    @GetMapping("/authenticate/{id}")
    public ResponseEntity<AccessToken> authenticate(@PathVariable String id) throws InvalidClassException {
        String googleTokenInfoUri = "https://www.googleapis.com/oauth2/v3/tokeninfo?idToken=" + id;
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Token> response = restTemplate.getForEntity(googleTokenInfoUri, Token.class);
        if(!response.getStatusCode().is2xxSuccessful() ||
                !response.getBody().getEmail_verified().equals("true")) {
            throw new InvalidClassException("Invalid Google Token");
        }
        UserDocument existingUser = userService.findOneByEmail(response.getBody().getEmail());
        if(existingUser == null) {
            UserDocument userDocument = new UserDocument();
//            if(response.getBody().getHd().equals("vaa.edu.vn")) {
//                userDocument.setId(Constant.getId(response.getBody().getEmail()));
//            }
            userDocument.setId(Constant.getId(response.getBody().getEmail()));
            userDocument.setEmail(response.getBody().getEmail());
            userDocument.setName(response.getBody().getName());
            userDocument.setAvatar(response.getBody().getPicture());
            userDocument.setRole(roleService.findOneByCode("STUDENT"));
            userDocument.setLoginAt(LocalDateTime.now().toString());
            userService.insert(userDocument);
        }
        else {
            existingUser.setLoginAt(LocalDateTime.now().toString());
            existingUser.setAvatar(response.getBody().getPicture());
            userService.update(existingUser);
        }
        var user = userDetailService.loadUserByUsername(response.getBody().getEmail());
        var access_token = jwtService.generateToken(user);
        return ResponseEntity.ok(AccessToken.builder().access_token(access_token).build());
    }
}
