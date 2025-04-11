package com.example.oj.service;

import com.example.oj.document.ProblemDocument;

import com.example.oj.document.TopicDocument;
import com.example.oj.document.TopicProblemDocument;
import com.example.oj.document.UserDocument;
import com.example.oj.dto.PageResponse;
import com.example.oj.dto.ProblemSmall;
import com.example.oj.dto.TopicProblem;
import com.example.oj.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProblemService {
    private final ProblemRepository problemRepository;
    private final TopicProblemRepository topicProblemRepository;
    private final TopicService topicService;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    public ProblemDocument insert(ProblemDocument problemDocument) {
        return problemRepository.insert(problemDocument);
    }

    public Integer count() {
        return problemRepository.countByState("PUBLIC");
    }

    public List<ProblemSmall> findAll(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 12);
        Page<ProblemDocument> pages = problemRepository.findAllByState("PUBLIC", pageable);
        List<ProblemSmall> list = new ArrayList<>();
        for (ProblemDocument problemDocument: pages.getContent()) {
            ProblemSmall problemSmall = new ProblemSmall().convert(problemDocument);
            ProblemSmall statistic = submissionRepository.getStatisticProblem(problemSmall.getId());
            problemSmall.setDifficulty(problemDocument.getDifficulty());
            if(statistic != null) {
                problemSmall.setTotal(statistic.getTotal());
                problemSmall.setTotalAC(statistic.getTotalAC());
            }
            list.add(problemSmall);
        }
        return list;
    }

    public Optional<ProblemDocument> findOne(String id) {
        return problemRepository.findById(id);
    }

    public List<ProblemSmall> findByCreator(String email, int pageNumber) {
        List<ProblemSmall> problemSmallList = new ArrayList<>();
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by("createdAt").descending());
        List<ProblemDocument> problems = problemRepository.findAllByEmail(email, pageable).getContent();
        for (ProblemDocument problem : problems) {
            problemSmallList.add(new ProblemSmall().convert(problem));
        }
        return problemSmallList;
    }

    public Map<String, Integer> countByEmail(String email) {
        Map<String, Integer> mp = new HashMap<>();
        mp.put("total", problemRepository.countByEmail(email));
        return mp;
    }

    public void update(String id) {
        ProblemDocument problemDocument = problemRepository.findById(id).get();
        problemDocument.setState("PUBLIC");
        problemRepository.save(problemDocument);
    }

    public void update(TopicProblem topicProblem) {
        ProblemDocument problem = topicProblem.getProblem();
        problemRepository.save(problem);
        topicProblemRepository.deleteByProblemId(problem.getId());
        List<TopicDocument> topics = topicProblem.getTopics();
        for(var x : topics) {
            TopicProblemDocument topicProblemDocument = new TopicProblemDocument();
            topicProblemDocument.setProblemId(problem.getId());
            topicProblemDocument.setTopicId(x.getId());
            topicProblemRepository.insert(topicProblemDocument);
        }
    }

    public Map<String, String> deleteProblem(String id, String email) {
        Optional<ProblemDocument> problemDocument = problemRepository.findById(id);
        UserDocument userDocument = userRepository.findOneByEmail(email);
        boolean ok = false;
        Map<String, String> mp = new HashMap<>();
        if(problemDocument.isPresent() && userDocument != null) {
            if(userDocument.getEmail().equals(problemDocument.get().getEmail())) {
                ok = true;
            }
            else if(userDocument.getRole().getCode().equals("ADMIN")) {
                ok = true;
            }
        }
        if(ok) {
            problemRepository.deleteById(id);
            submissionRepository.deleteByProblemId(id);
            mp.put("result", "success");
        }
        else {
            mp.put("result", "error");
        }
        return mp;
    }

    public List<ProblemSmall> findByKeyword(String keyword) {
        List<ProblemDocument> list = problemRepository.findByTitleContaining(keyword);
        List<ProblemSmall> problems = new ArrayList<>();
        for (ProblemDocument li: list) {
            problems.add(new ProblemSmall().convert(li));
        }
        return problems;
    }

    public Map<String, Object> search(Map<String, Object> data) {
        String keyword = (String) data.get("search");
        String difficultyCode = (String) data.get("difficulty");
        String id = (String) data.get("id");
        int pageIndex = (int) data.get("pageNumber");
        int pageSize = 12;
        PageResponse page = problemRepository.search(
                keyword, difficultyCode, id,
                pageIndex * pageSize, pageSize
        );
        long total = page != null && !page.getTotal().isEmpty()
                ? page.getTotal().get(0).getTotalCount() : 0;
        assert page != null;
        for(ProblemSmall problem : page.getPagedProblemResults()) {
            ProblemSmall statistic = submissionRepository.getStatisticProblem(problem.getId());
            if(statistic != null) {
                problem.setTotal(statistic.getTotal());
                problem.setTotalAC(statistic.getTotalAC());
            }
        }

        Map<String, Object> mp = new HashMap<>();
        mp.put("list", page.getPagedProblemResults());
        mp.put("total", total);
        return mp;
    }

    //administration
    public List<ProblemSmall> findAllManage(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 12, Sort.by("testcase"));
        Page<ProblemDocument> problemDocuments = problemRepository.findAll(pageable);
        List<ProblemSmall> problems = new ArrayList<>();
        for (ProblemDocument problemDocument: problemDocuments.getContent()) {
            problems.add(new ProblemSmall().convert(problemDocument));
        }
        return problems;
    }
    public Integer countAll() {
        return Math.toIntExact(problemRepository.count());
    }

    public Map<String, Object> getDetail(String problemId) {
        Optional<ProblemDocument> problemDocument = problemRepository.findById(problemId);
        ProblemSmall statistic = submissionRepository.getStatisticProblem(problemId);
        List<TopicDocument> topics = topicService.findByProblemId(problemId);
        if(problemDocument.isPresent()) {
            Map<String, Object> mp = new HashMap<>();
            mp.put("problem", problemDocument.get());
            mp.put("statistic", statistic);
            mp.put("topics", topics != null ? topics : new ArrayList<>());
            return mp;
        }
        return null;
    }

    public Map<String, Object> search(String keyword, int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 12);
        Page<ProblemDocument> page = problemRepository.findByTitleContaining(keyword, pageable);
        Integer total = problemRepository.countByTitleContaining(keyword);
        if(page != null && total != null) {
            Map<String, Object> mp = new HashMap<>();
            List<ProblemSmall> problemSmallList = new ArrayList<>();
            for (ProblemDocument problemDocument: page.getContent()) {
                problemSmallList.add(new ProblemSmall().convert(problemDocument));
            }
            mp.put("list", problemSmallList);
            mp.put("total", total);
            return mp;
        }
        return null;
    }

    public List<Map<String, Object>> handleTestcase(List<Map<String, Object>> testcases) {
        List<ProblemDocument> problemDocuments = problemRepository.findAll();
        List<String> nameFolder = new ArrayList<>();
        for (ProblemDocument problemDocument : problemDocuments) {
            if(problemDocument.getTestcase().size() != 0) {
                String path = problemDocument.getTestcase().get(0).get("input");
                String[] segments = path.split("\\\\");
                nameFolder.add(segments[2]);
            }
        }
        List<Map<String, Object>> data = new ArrayList<>();
        for (Map<String, Object> testcase: testcases) {
            boolean ok = false;
            for (String name: nameFolder) {
                if(testcase.get("name").equals(name)) {
                    ok = true;
                }
            }
            if(!ok) {
                data.add(testcase);
            }
        }
        return data;
    }
}
