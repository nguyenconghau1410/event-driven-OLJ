package com.example.oj.service;

import com.example.oj.constant.Constant;
import com.example.oj.document.RoleDocument;
import com.example.oj.document.UserDocument;
import com.example.oj.dto.StatisticContest;
import com.example.oj.repository.RoleRepository;
import com.example.oj.repository.SubmissionRepository;
import com.example.oj.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SubmissionRepository submissionRepository;

    public UserDocument insert(UserDocument userDocument) {
        return userRepository.insert(userDocument);
    }
    public UserDocument findOneByEmail(String email) {
        return userRepository.findOneByEmail(email);
    }

    public Optional<UserDocument> findUser(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<UserDocument> findUserById(String id) {
        return userRepository.findById(id);
    }
    public void updateUser(String email, Map<String, String> data) {
        UserDocument userDocument = userRepository.findOneByEmail(email);
        userDocument.setName(data.get("name"));
        userDocument.setFaculty(data.get("faculty"));
        userDocument.setClassname(data.get("classname"));
        userRepository.save(userDocument);
    }

    public void update(UserDocument userDocument) {
        userRepository.save(userDocument);
    }

    public Map<String, Object> getInfoUser(String id) {
        Optional<UserDocument> userDocument = userRepository.findById(id);
        Map<String, Object> mp = new HashMap<>();
        if(userDocument.isPresent()) {
            mp.put("user", userDocument.get());
            mp.put("totalAC", submissionRepository.getTotalAC(id) != null ? submissionRepository.getTotalAC(id).getTotal() : 0);
            mp.put("total", submissionRepository.getTotalSolved(id) != null ? submissionRepository.getTotalSolved(id).getTotal(): 0);
            mp.put("top", submissionRepository.getTopRatingUser(id).getIndex());
            mp.put("totalSubmissions", submissionRepository.countByUserId(id));
            return mp;
        }
        return null;
    }

    // administration
    public List<UserDocument> getUsers(int pageNumber) {
        return userRepository.getUsers(pageNumber * 12);
    }

    public long countUsers() {
        return userRepository.count();
    }

    public Map<String, String> deleteUser(String email, String id) {
        Optional<UserDocument> userDocument = userRepository.findByEmail(email);
        Map<String, String> mp = new HashMap<>();
        if(userDocument.isPresent()) {
            if(userDocument.get().getRole().getCode().equals("ADMIN") && !id.equals(Constant.getId(email))) {
                userRepository.deleteById(id);
                mp.put("result", "success");
            }
        }
        else {
            mp.put("result", "error");
        }
        return mp;
    }

    public Map<String, String> exchangeRole(String email, Map<String, String> data) {
        Optional<UserDocument> userDocument = userRepository.findByEmail(email);
        Map<String, String> mp = null;
        if(userDocument.isPresent()) {
            mp = new HashMap<>();
            if(userDocument.get().getRole().getCode().equals("ADMIN")) {
                Optional<UserDocument> user = userRepository.findByEmail(data.get("email"));
                if(user.isPresent()) {
                    user.get().setRole(roleRepository.findOneByCode(data.get("code")));
                    userRepository.save(user.get());
                    mp.put("result", "success");
                }
                else {
                    mp.put("result", "not exist");
                }
            }
        }
        else {
            mp.put("result", "error");
        }
        return mp;
    }

    public Map<String, Object> findByNameContaining(String keyword, int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 12, Sort.by("loginAt"));
        Page<UserDocument> page = userRepository.findByNameContaining(keyword, pageable);
        Integer total = userRepository.countByNameContaining(keyword);
        if(page != null && total != null) {
            Map<String, Object> data = new HashMap<>();
            data.put("list", page.getContent());
            data.put("total", total);
            return data;
        }
        return null;
    }
}
