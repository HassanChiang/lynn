package com.fenxiangz.lynn.conf.properties;


import lombok.Data;
import lombok.ToString;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ToString
@ConfigurationProperties(prefix = OssProperties.PREFIX)
public class OssProperties {
    public static final String PREFIX = "oss";
    private String accessKey;
    private String secretKey;
    private String space;
    private String domain;
    private OssType type = OssType.QiNiu;
}
