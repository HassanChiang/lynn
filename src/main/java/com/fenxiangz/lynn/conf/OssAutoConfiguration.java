package com.fenxiangz.lynn.conf;

import com.fenxiangz.lynn.conf.properties.OssProperties;
import com.fenxiangz.lynn.conf.properties.OssType;
import com.fenxiangz.lynn.core.AliOssFileServiceImpl;
import com.fenxiangz.lynn.core.OssFileService;
import com.fenxiangz.lynn.core.QiNiuOssFileServiceImpl;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Log
@Configuration
@EnableConfigurationProperties(OssProperties.class)
public class OssAutoConfiguration {

    @Autowired
    private OssProperties properties;

    @Bean
    @ConditionalOnMissingBean
    public OssFileService ossFileService() {
        OssType ossType = properties.getType();
        switch (ossType) {
            case QiNiu:
                return new QiNiuOssFileServiceImpl(properties);
            case AliYun:
                return new AliOssFileServiceImpl(properties);
            default:
                throw new IllegalArgumentException("OSS类型[" + ossType + "]不支持");
        }
    }

}
