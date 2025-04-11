package com.example.oj.document;

import com.example.oj.dto.Participant;
import com.example.oj.dto.SignUp;
import com.example.oj.dto.TaskContest;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "contest")
@Data
public class ContestDocument {
    @Id
    private String id;
    private String title;
    private String description;
    private String createdBy;
    private String startTime;
    private String hourStart;
    private String endTime;
    private String hourEnd;
    private List<TaskContest> problems;
    private List<SignUp> signups;
    private List<Participant> participants;
    private String state;
    private String mode;
    private String createdAt;
    private boolean isFinished;
    private boolean noTime;
}
