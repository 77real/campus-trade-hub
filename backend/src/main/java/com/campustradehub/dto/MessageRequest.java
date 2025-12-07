package com.campustradehub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageRequest {
    @NotNull
    private Long receiverId;

    private Long itemId;

    @NotBlank
    private String content;
}
