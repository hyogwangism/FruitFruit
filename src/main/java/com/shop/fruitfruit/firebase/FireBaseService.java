package com.shop.fruitfruit.firebase;

import com.google.api.gax.paging.Page;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import com.shop.fruitfruit.admin.AdminMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

@Service
@Slf4j
public class FireBaseService {

    //    @Value("${firebase.bucket}")
    private String firebaseBucket = "fruitfruit-1cf5f.appspot.com";
    private final AdminMapper adminMapper;

    public FireBaseService(AdminMapper adminMapper) {
        this.adminMapper = adminMapper;
    }

    public HashMap<String, Object> uploadFiles(MultipartFile imgFiles) throws IOException {

        if (!imgFiles.isEmpty()) {
            Calendar cal = Calendar.getInstance();
            int year = cal.get(Calendar.YEAR);
            int month = cal.get(Calendar.MONTH) + 1;
            int date = cal.get(Calendar.DATE);

            String homedir = year + "-" + month + "-" + date;
            String fileName = "photo" + System.currentTimeMillis() + "_" + imgFiles.getOriginalFilename();
            String fileDBName = homedir + "/" + fileName;
            log.info(homedir + ", " + fileName + ", " + fileDBName + ", " + firebaseBucket);

            Bucket bucket = StorageClient.getInstance().bucket(firebaseBucket);
            InputStream content = new ByteArrayInputStream(imgFiles.getBytes());
            Blob blob = bucket.create(fileDBName, content, imgFiles.getContentType());

            HashMap<String, Object> paramMap = new HashMap<>();
            paramMap.put("fileDBName", fileDBName);
            paramMap.put("fireBaseImageUrl", blob.getMediaLink());
            return paramMap;
        }
        return null;
    }

    public void deleteImageFiles(List<HashMap<String, Object>> paramList) {
        for (HashMap<String, Object> paramMap : paramList) {
            String filePath = paramMap.get("file_path").toString(); // 파일 경로 키로 변경

            Bucket bucket = StorageClient.getInstance().bucket(firebaseBucket);
            Page<Blob> blobs = bucket.list();

            for (Blob blob : blobs.iterateAll()) {
                if (blob.getName().equals(filePath)) {
                    log.info("삭제할 이미지를 찾았습니다. : {}", blob);

                    boolean deleted = blob.delete();
                    if (deleted) {
                        log.info("이미지가 성공적으로 삭제되었습니다.");
                    }
                }
            }

        }
    }
}
