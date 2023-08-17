package com.shop.fruitproject.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserMapper{

    private final UserMapper userMapper;
    @Override
    public List<HashMap<String, Object>> testSelect() {
        return userMapper.testSelect();
    }
}
