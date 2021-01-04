package visualmserver.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Objects;

@Entity
public class AppConfig {
    @Id
    @Column(name = "key_name")
    private String key;
    private String value;

    public AppConfig() {
    }

    public AppConfig(String key, String value) {
        this.key = key;
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AppConfig appConfig = (AppConfig) o;
        return Objects.equals(key, appConfig.key) &&
                Objects.equals(value, appConfig.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(key, value);
    }
}
