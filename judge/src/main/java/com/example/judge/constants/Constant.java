package com.example.judge.constants;

public class Constant {

    public static String getId(String email) {
        String id = "";
        for(int i = 0; i < email.length(); i++) {
            if(email.charAt(i) == '@') break;
            id += email.charAt(i);
        }
        return id;
    }

    public static String handlePath(String testcase) {
        String res = testcase;
        if (testcase.charAt(1) == '\\') {
            res = testcase.replace("\\", "/");
        }
        return res;
    }
}
