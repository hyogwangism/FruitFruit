package com.shop.fruitfruit.main;

import org.apache.ibatis.annotations.Mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Mapper
public interface MainMapper {

    List<HashMap<String, Object>> selectAllProductInfo(HashMap<String, Object> paramMap);

    List<HashMap<String, Object>> selectProductBySortSearchField(HashMap<String, Object> paramMap);

    void insertProductLike(HashMap<String, Object> paramMap);

    HashMap<String, Object> selectProductLikeByProductId(HashMap<String, Object> paramMap);

    void deleteProductLike(HashMap<String, Object> paramMap);

    List<HashMap<String, Object>> selectProductLikeListByUserId(HashMap<String, Object> paramMap);
}
