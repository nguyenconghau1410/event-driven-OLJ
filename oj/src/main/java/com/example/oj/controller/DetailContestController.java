package com.example.oj.controller;

import com.example.oj.constant.Constant;
import com.example.oj.constant.Utils;
import com.example.oj.document.DetailContest;
import com.example.oj.document.ProblemDocument;
import com.example.oj.document.SubmissionDocument;
import com.example.oj.dto.Execute;
import com.example.oj.dto.ResultTestCase;
import com.example.oj.producer.MessageProducer;
import com.example.oj.service.DetailContestService;
import com.example.oj.service.ProblemService;
import com.example.oj.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Controller
@RequiredArgsConstructor
public class DetailContestController {

    private final SimpMessagingTemplate messagingTemplate;
    private final DetailContestService detailContestService;
    private final ProblemService problemService;
    private final MessageProducer producer;
    @MessageMapping("/contest/execute")
    public void executeCode(@Payload String id) throws IOException {
        DetailContest detailContest = detailContestService.findById(id).get();
        ProblemDocument problemDocument = problemService.findOne(detailContest.getProblemId()).get();
        if(detailContest.getResult() != null) return;
        producer.judgeSubmission(detailContest, problemDocument, "exam");
    }
}
