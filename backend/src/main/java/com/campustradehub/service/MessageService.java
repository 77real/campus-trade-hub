package com.campustradehub.service;

import com.campustradehub.dto.MessageRequest;
import com.campustradehub.model.Item;
import com.campustradehub.model.Message;
import com.campustradehub.model.User;
import com.campustradehub.repository.ItemRepository;
import com.campustradehub.repository.MessageRepository;
import com.campustradehub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    public MessageService(MessageRepository messageRepository,
                         UserRepository userRepository,
                         ItemRepository itemRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
    }

    public List<Message> getUserMessages(Long userId) {
        return messageRepository.findByUserId(userId);
    }

    public List<Message> getConversation(Long userId1, Long userId2) {
        return messageRepository.findConversation(userId1, userId2);
    }

    @Transactional
    public Message sendMessage(MessageRequest request, Long senderId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent());

        if (request.getItemId() != null) {
            Item item = itemRepository.findById(request.getItemId())
                    .orElse(null);
            message.setItem(item);
        }

        return messageRepository.save(message);
    }

    @Transactional
    public Message markAsRead(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getReceiver().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        message.setIsRead(true);
        return messageRepository.save(message);
    }
}
