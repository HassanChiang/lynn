package com.fenxiangz.lynn.core;

import cn.hutool.core.date.DateTime;
import com.fenxiangz.lynn.exception.UploadOssException;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;

public interface OssFileService {

    default String upload(MultipartFile file) {
        try {
            File uploadFile = new File("/usr/share/nginx/lynn_image/" + file.getOriginalFilename());
            file.transferTo(uploadFile);
            return upload(uploadFile);
        } catch (Exception e) {
            throw new UploadOssException("文件上传失败");
        }
    }

    default String upload(File file) {
        return upload(file, getFileName(file));
    }

    String upload(File file, String filename);

    default String upload(File file, String filename, String space) {
        try {
            return upload(Files.newInputStream(file.toPath()), filename, space);
        } catch (IOException e) {
            throw new UploadOssException("文件上传失败");
        }
    }

    String upload(InputStream is, String filename, String space);

    default String getFileName(File file) {
        return new DateTime().toDateStr() + "/" + file.getName();
    }
}
