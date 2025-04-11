package com.example.oj.controller;

import com.example.oj.document.ProblemDocument;
import com.example.oj.document.SubmissionDocument;
import com.example.oj.producer.MessageProducer;
import com.example.oj.service.ProblemService;
import com.example.oj.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.io.*;
import java.util.*;


@Controller
@RequiredArgsConstructor
public class SubmissionController {

    private final SimpMessagingTemplate messagingTemplate;
    private final SubmissionService submissionService;
    private final ProblemService problemService;
    private final MessageProducer producer;
    @MessageMapping("/execute")
    public void executeCode(@Payload String id) throws IOException {
        Optional<SubmissionDocument> submissionDocumentOptional = submissionService.findOne(id);
        SubmissionDocument submissionDocument;
        ProblemDocument problemDocument;
        if(submissionDocumentOptional.isPresent()) {
            submissionDocument = submissionDocumentOptional.get();
            if(submissionDocument.getResult() != null) return;
            problemDocument = problemService.findOne(submissionDocument.getProblemId()).get();
            producer.judgeSubmission(submissionDocument, problemDocument, "normal");
        }
    }
    @MessageMapping("/submission")
    public void response(@Payload String id) {
        messagingTemplate.convertAndSendToUser(
                "public", "/queue/messages",
                submissionService.findOne(id)
        );
    }
}
