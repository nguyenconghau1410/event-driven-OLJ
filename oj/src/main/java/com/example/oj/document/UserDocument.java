package com.example.oj.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "user")
@Data
public class UserDocument {
    @Id
    private String id;
    private String email;
    private String name;
    private String avatar;
    private String faculty;
    private String classname;
    private String loginAt;
    private RoleDocument role;
}
