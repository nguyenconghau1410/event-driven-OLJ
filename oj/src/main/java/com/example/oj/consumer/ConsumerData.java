package com.example.oj.consumer;


import com.example.oj.config.RabbitMQConfig;
import com.example.oj.document.DetailContest;
import com.example.oj.document.SubmissionDocument;
import com.example.oj.service.DetailContestService;
import com.example.oj.service.SubmissionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ConsumerData {
    private final SimpMessagingTemplate messagingTemplate;
    private final SubmissionService submissionService;
    private final DetailContestService detailContestService;
    @RabbitListener(queues = RabbitMQConfig.RESPONSE_QUEUE)
    public void receiveSolution(Message returnData) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> requestMessage = objectMapper.readValue(returnData.getBody(), Map.class);
        String type = objectMapper.convertValue(requestMessage.get("type"), String.class);
        if(type.equals("exam")) {
            DetailContest response = objectMapper.convertValue(requestMessage.get("response"), DetailContest.class);
            detailContestService.update(response);
            Map<String, Object> mp = new HashMap<>();
            mp.put("data", response);
            messagingTemplate.convertAndSendToUser(
                    response.getId(), "/queue/messages",
                    mp
            );
        }
        else {
            SubmissionDocument response = objectMapper.convertValue(requestMessage.get("response"), SubmissionDocument.class);
            submissionService.update(response);
            Map<String, Object> mp = new HashMap<>();
            mp.put("data", response);
            messagingTemplate.convertAndSendToUser(
                    response.getId(), "/queue/messages",
                    mp
            );
        }
    }
}
