package com.shop.fruitfruit.user;

import lombok.Getter;

@Getter
public class UserVO {



    private String id;
    private String pw;
    private String name;
    private String phone;

    public UserVO(String pw, String name, String phone) {
        this.pw = pw;
        this.name = name;
        this.phone = phone;
    }
}
