package com.example.oj.service;

import com.example.oj.constant.Constant;
import com.example.oj.constant.Utils;
import com.example.oj.document.SubmissionDocument;
import com.example.oj.document.UserDocument;
import com.example.oj.dto.*;
import com.example.oj.repository.SubmissionRepository;
import com.example.oj.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.time.LocalDateTime;
import java.util.*;


@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final Utils utils;
    public SubmissionDocument insert(Submission submission, String email) {
        UserDocument userDocument = userRepository.findOneByEmail(email);
        SubmissionDocument submissionDocument = new SubmissionDocument();
        submissionDocument.setSource(submission.getCode());
        submissionDocument.setLanguage(submission.getLanguage());
        submissionDocument.setUserId(userDocument.getId());
        submissionDocument.setName(userDocument.getName());
        submissionDocument.setProblemId(submission.getProblem().getId());
        submissionDocument.setTitle(submission.getProblem().getTitle());
        submissionDocument.setTotalTest(submission.getProblem().getTestcase().size());
        submissionDocument.setCreatedAt(LocalDateTime.now().toString());
        return submissionRepository.insert(submissionDocument);
    }

    public Optional<SubmissionDocument> findOne(String id) {
        return submissionRepository.findById(id);
    }
    public void update(SubmissionDocument submissionDocument) {
        submissionRepository.save(submissionDocument);
    }

    public List<SubmissionDocument> getAll(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 15, Sort.by("createdAt").descending());
        Page<SubmissionDocument> page = submissionRepository.findAll(pageable);
        List<SubmissionDocument> list = page.getContent();
        return list;
    }

    public Integer count() {
        return Math.toIntExact(submissionRepository.count());
    }

    public Integer countSubmissionProblem(String problemId, String email, String type) {
        if(type.equals("all-submissions")) {
            return submissionRepository.countByProblemId(problemId);
        }
        else {
            return submissionRepository.countByProblemIdAndUserId(problemId, Constant.getId(email));
        }
    }

    public Optional<SubmissionDocument> execute(String id) {
        return submissionRepository.findById(id);
    }

    public List<SubmissionDocument> getSubmissionOfProblem(String problemId, String email, Integer pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 15, Sort.by("createdAt").descending());
        Page<SubmissionDocument> page = submissionRepository.findByProblemIdAndUserId(problemId, Constant.getId(email), pageable);
        return page.getContent();
    }

    public List<SubmissionDocument> getSubmissionByProblem(String problemId, Integer pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 15, Sort.by("createdAt").descending());
        Page<SubmissionDocument> page = submissionRepository.findByProblemId(problemId, pageable);
        return page.getContent();
    }

    public List<Statistic> getStatistic() {
        return submissionRepository.getStatistic();
    }

    public Map<String, Integer> countMySubmission(String email) {
        String userId = Constant.getId(email);
        Map<String, Integer> mp = new HashMap<>();
        mp.put("total", submissionRepository.countByUserId(userId));
        return mp;
    }

    public List<SubmissionDocument> getSubmissionByUserId(String email, Integer pageNumber) {
        String userId = Constant.getId(email);
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by("createdAt").descending());
        Page<SubmissionDocument> submissionDocuments = submissionRepository.findByUserId(userId, pageable);
        return submissionDocuments.getContent();
    }

    public Map<String, Long> getFigure(String email) {
        String userId = Constant.getId(email);
        StatisticContest solved = submissionRepository.getTotalSolved(userId);
        StatisticContest ac = submissionRepository.getTotalAC(userId);
        TopRating topRating = submissionRepository.getTopRatingUser(userId);
        Map<String, Long> mp = new HashMap<>();
        if(solved == null) {
            solved = new StatisticContest();
            solved.setTotal(0L);
        }
        if(ac == null) {
            ac = new StatisticContest();
            ac.setTotal(0L);
        }
        mp.put("total", solved.getTotal());
        mp.put("totalAC", ac.getTotal());
        mp.put("top", (long) topRating.getIndex());
        return mp;
    }

    public List<Map<String, Object>> getTopUser(int pageNumber) {
        List<LeaderBoard> list = submissionRepository.getLeaderboardUser(pageNumber * 25);
        List<Map<String, Object>> data = new ArrayList<>();
        for (LeaderBoard lead: list) {
            Optional<UserDocument> userDocument = userRepository.findById(lead.getId());
            if(userDocument.isPresent()) {
                Map<String, Object> mp = new HashMap<>();
                mp.put("userId", lead.getId());
                mp.put("name", userDocument.get().getName());
                mp.put("totalSolutions", lead.getTotalSolutions());
                mp.put("faculty", userDocument.get().getFaculty());
                mp.put("classname", userDocument.get().getClassname());
                data.add(mp);
            }
        }
        return data;
    }

    public Map<String, Long> countAllUser() {
        Map<String, Long> mp = new HashMap<>();
        mp.put("total", submissionRepository.countAllUser().getTotal());
        return mp;
    }

    public List<SubmissionDocument> getACList(String userId, int pageNumber) {
        List<DetailLeaderboard> list = submissionRepository.getACList(userId, pageNumber * 10);
        List<SubmissionDocument> submissionDocuments = new ArrayList<>();
        for (DetailLeaderboard detail: list) {
            submissionDocuments.add(detail.getSubmission());
        }
        return submissionDocuments;
    }

    public StatisticContest countACList(String userId) {
        return submissionRepository.countACList(userId);
    }

    public Map<String, String> deleteSubmissionsNotAC(String problemId, String email) {
        Optional<UserDocument> userDocument = userRepository.findByEmail(email);
        if(userDocument.isPresent()) {
            Map<String, String > mp = new HashMap<>();
            if(userDocument.get().getRole().getCode().equals("ADMIN")) {
                submissionRepository.deleteByProblemIdAndResultNot(problemId, "ACCEPTED");
                mp.put("result", "success");
            }
            else {
                mp.put("result", "error");
            }
            return mp;
        }
        return null;
    }
}
