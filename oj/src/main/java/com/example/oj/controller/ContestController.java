package com.example.oj.controller;


import com.example.oj.document.ContestDocument;
import com.example.oj.dto.Participant;
import com.example.oj.service.ContestService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ContestController {
    private final ContestService contestService;
    private final SimpMessagingTemplate messagingTemplate;
    @MessageMapping("/notify")
    public void response(@Payload Map<String, String> data) {
        String content = data.get("content");
        String contestId = data.get("id");

        ContestDocument contestDocument = contestService.findOne(contestId);

        for (Participant participant : contestDocument.getParticipants()) {
            Map<String, String> mp = new HashMap<>();
            mp.put("content", content);
            mp.put("title", contestDocument.getTitle());

            messagingTemplate.convertAndSendToUser(
                    participant.getEmail(), "/queue/notifications",
                    mp
            );
        }
    }
}
