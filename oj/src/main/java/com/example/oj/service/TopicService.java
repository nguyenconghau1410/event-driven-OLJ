package com.example.oj.service;

import com.example.oj.document.*;
import com.example.oj.dto.ProblemSmall;
import com.example.oj.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.parsing.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TopicService {
    private final TopicRepository topicRepository;
    private final TopicProblemRepository topicProblemRepository;
    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    public TopicDocument insert(TopicDocument topicDocument) {
        Optional<TopicDocument> optional = topicRepository.findByCode(topicDocument.getCode());
        if(optional.isPresent()) {
            return null;
        }
        return topicRepository.insert(topicDocument);
    }
    public List<TopicDocument> findAll() {
        return topicRepository.findAll();
    }

    public TopicProblemDocument insert(TopicProblemDocument topicProblemDocument) {
        return topicProblemRepository.insert(topicProblemDocument);
    }

    public List<TopicDocument> findByProblemId(String problemId) {
        List<TopicProblemDocument> list = topicProblemRepository.findByProblemId(problemId);
        List<TopicDocument> topics = new ArrayList<>();
        for(var x : list) {
            topics.add(topicRepository.findById(x.getTopicId()).get());
        }
        return topics;
    }

    public Map<String, Object> findByTopicId(String topicId, Integer pageNumber) {
        Integer total = topicProblemRepository.countByTopicId(topicId);
        Pageable pageable = PageRequest.of(pageNumber, 12);
        Page<TopicProblemDocument> list = topicProblemRepository.findByTopicId(topicId, pageable);
        List<ProblemSmall> problems = new ArrayList<>();
        for(var x : list.getContent()) {
            Optional<ProblemDocument> problemDocument = problemRepository.findById(x.getProblemId());
            if(problemDocument.isPresent()) {
                ProblemSmall problemSmall = new ProblemSmall().convert(problemDocument.get());
                problemSmall.setDifficulty(problemDocument.get().getDifficulty());
                ProblemSmall statistic = submissionRepository.getStatisticProblem(problemDocument.get().getId());
                problemSmall.setDifficulty(problemDocument.get().getDifficulty());
                if(statistic != null) {
                    problemSmall.setTotal(statistic.getTotal());
                    problemSmall.setTotalAC(statistic.getTotalAC());
                }
                problems.add(problemSmall);
            }
        }
        Map<String, Object> mp = new HashMap<>();
        mp.put("list", problems);
        mp.put("total", total);
        return mp;
    }

    public Map<String, String> delete(String email, String id) {
        Optional<UserDocument> userDocument = userRepository.findByEmail(email);
        if(userDocument.isPresent()) {
            Map<String, String> mp = new HashMap<>();
            if(userDocument.get().getRole().getCode().equals("ADMIN")) {
                topicRepository.deleteById(id);
                topicProblemRepository.deleteByTopicId(id);
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
