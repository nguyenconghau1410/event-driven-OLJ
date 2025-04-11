package com.example.oj.service;

import com.example.oj.document.DetailContest;
import com.example.oj.document.UserDocument;
import com.example.oj.dto.*;
import com.example.oj.repository.DetailContestRepository;
import com.example.oj.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DetailContestService {
    private final DetailContestRepository detailContestRepository;
    private final UserRepository userRepository;

    public DetailContest insert(Submission submission, String email) {
        UserDocument userDocument = userRepository.findOneByEmail(email);
        DetailContest detailContest = new DetailContest();
        detailContest.setSource(submission.getCode());
        detailContest.setLanguage(submission.getLanguage());
        detailContest.setUserId(userDocument.getId());
        detailContest.setName(userDocument.getName());
        detailContest.setProblemId(submission.getProblem().getId());
        detailContest.setTitle(submission.getProblem().getTitle());
        detailContest.setTotalTest(submission.getProblem().getTestcase().size());
        detailContest.setCreatedAt(LocalDateTime.now().toString());
        detailContest.setNameContest(submission.getContest().getTitle());
        detailContest.setContestId(submission.getContest().getId());
        for (TaskContest task: submission.getContest().getProblems()) {
            if(task.getId().equals(submission.getProblem().getId())) {
                detailContest.setMaxScored((float) task.getPoint());
                break;
            }
        }
        return detailContestRepository.insert(detailContest);
    }

    public void update(DetailContest detailContest) {
        detailContestRepository.save(detailContest);
    }

    public Optional<DetailContest> findById(String id) {
        return detailContestRepository.findById(id);
    }

    public List<DetailContest> getAll(String contestId, int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 15, Sort.by("createdAt").descending());
        return detailContestRepository.findByContestId(contestId, pageable).getContent();
    }

    public List<DetailContest> getByContestIdAndUserId(String contestId, String userId, int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 15, Sort.by("createdAt").descending());
        return detailContestRepository.findByContestIdAndUserId(contestId, userId, pageable).getContent();
    }
    public List<DetailContest> getByContestIdAndProblemId(String contestId, String problemId, int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 15, Sort.by("createdAt").descending());
        return detailContestRepository.findByContestIdAndProblemId(contestId, problemId, pageable).getContent();
    }

    public Map<String, Integer> countSubmissions(String contestId, String userId, String problemId) {
        Map<String, Integer> mp = new HashMap<>();
        if(problemId.equals("empty") && userId.equals("empty")) {
            mp.put("count", detailContestRepository.countByContestId(contestId));
        }
        else if(problemId.equals("empty")) {
            mp.put("count", detailContestRepository.countByContestIdAndUserId(contestId, userId));
        }
        else {
            mp.put("count", detailContestRepository.countByContestIdAndProblemId(contestId, problemId));
        }
        return mp;
    }

    public List<LeaderBoard> getLeaderBoard(String contestId, Integer pageNumber) {
        return detailContestRepository.getLeaderBoard(contestId, pageNumber * 30);
    }

    public StatisticContest countLeaderBoard(String contestId) {
        return detailContestRepository.countLeaderBoard(contestId);
    }

    public List<DetailLeaderboard> getDetailLeaderboard(String contestId, String userId) {
        return detailContestRepository.getDetailLeaderBoard(contestId, userId);
    }

    public StatisticContest getStatisticNumber(String contestId) {
        return detailContestRepository.getStatisticNumber(contestId);
    }

    public List<Statistic> getStatisticBoard(String contestId) {
        return detailContestRepository.getStatisticBoard(contestId);
    }

    public TopRating getTopRating(String contestId, String userId) {
        return detailContestRepository.getTopRating(contestId, userId);
    }
}
