package com.example.judge.configuration;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQConfig {
    public static final String REQUEST_QUEUE = "judge.request.queue";
    public static final String RESPONSE_QUEUE = "api.response.queue";
    public static final String EXCHANGE = "example.exchange";
    public static final String REQUEST_ROUTING_KEY = "request.routing.key";
    public static final String RESPONSE_ROUTING_KEY = "response.routing.key";


    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
        rabbitTemplate.setUseDirectReplyToContainer(true);
        rabbitTemplate.setReplyTimeout(100000);
        return rabbitTemplate;
    }
    @Bean
    public Queue requestQueue() {
        return new Queue(REQUEST_QUEUE, true, false, false);
    }

    @Bean
    public Queue responseQueue() {
        return new Queue(RESPONSE_QUEUE, true, false, false);
    }

    @Bean
    public TopicExchange exchangeRequest() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Binding requestBinding(Queue requestQueue, TopicExchange exchange) {
        return BindingBuilder.bind(requestQueue).to(exchange).with(REQUEST_ROUTING_KEY);
    }

    @Bean
    public Binding responseBinding(Queue responseQueue, TopicExchange exchange) {
        return BindingBuilder.bind(responseQueue).to(exchange).with(RESPONSE_ROUTING_KEY);
    }
}
