package com.example.oj.producer;

import com.example.oj.config.RabbitMQConfig;
import com.example.oj.document.DetailContest;
import com.example.oj.document.ProblemDocument;
import com.example.oj.document.SubmissionDocument;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageProducer {
    private final RabbitTemplate rabbitTemplate;
    public void judgeSubmission(Object data, ProblemDocument problemDocument, String type) throws IOException {
        Map<String, Object> message = new HashMap<>();
        if(data instanceof SubmissionDocument) {
            message.put("submission", (SubmissionDocument)data);
        }
        else {
            message.put("exam", (DetailContest)data);
        }
        message.put("problem", problemDocument);
        message.put("type", type);
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.REQUEST_ROUTING_KEY,
                message
        );
    }
}
