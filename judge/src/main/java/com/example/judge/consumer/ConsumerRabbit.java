package com.example.judge.consumer;

import com.example.judge.configuration.RabbitMQConfig;
import com.example.judge.model.DetailResult;
import com.example.judge.model.Problem;
import com.example.judge.model.SubmissionDocument;
import com.example.judge.service.JudgeService;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ConsumerRabbit {
    private final RabbitTemplate rabbitTemplate;
    private final JudgeService judgeService;
    @RabbitListener(queues = RabbitMQConfig.REQUEST_QUEUE)
    public void receiveRequest(Message request) throws IOException, InterruptedException {
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> requestMessage = objectMapper.readValue(request.getBody(), Map.class);
        SubmissionDocument submission = objectMapper.convertValue(requestMessage.get("submission"), SubmissionDocument.class);
        Problem problem = objectMapper.convertValue(requestMessage.get("problem"), Problem.class);
        DetailResult exam = objectMapper.convertValue(requestMessage.get("exam"), DetailResult.class);
        String type = objectMapper.convertValue(requestMessage.get("type"), String.class);
        SubmissionDocument responseMessage = null;
        DetailResult detailResult = null;
        if(type.equals("normal"))
            responseMessage = judgeService.compileAndExecute(submission, problem);
        else
            detailResult = judgeService.compileAndExecute(exam, problem);
        Map<String, Object> mp = new HashMap<>();
        mp.put("response", responseMessage == null ? detailResult : responseMessage);
        mp.put("type", type);
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.RESPONSE_ROUTING_KEY, mp);
    }
}
