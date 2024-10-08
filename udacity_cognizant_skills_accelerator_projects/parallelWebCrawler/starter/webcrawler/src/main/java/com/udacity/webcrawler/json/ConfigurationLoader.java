package com.udacity.webcrawler.json;

import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;

/**
 * A static utility class that loads a JSON configuration file.
 */
public final class ConfigurationLoader {

  private final Path path;

  /**
   * Create a {@link ConfigurationLoader} that loads configuration from the given {@link Path}.
   */
  public ConfigurationLoader(Path path) {
    this.path = Objects.requireNonNull(path);
  }

  /**
   * Loads configuration from this {@link ConfigurationLoader}'s path
   *
   * @return the loaded {@link CrawlerConfiguration}.
   */
  public CrawlerConfiguration load() {
    // TODO: Fill in this method.
    try (BufferedReader reader = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
      return read(reader);
    } catch (IOException ex) {
      /*
        I am wrapping the exception to avoid adding throws clause to method because the
        clause was not added as part of the boilerplate code given to me for the assignment.
      */
      throw new RuntimeException(ex);
    }
  }

  /**
   * Loads crawler configuration from the given reader.
   *
   * @param reader a Reader pointing to a JSON string that contains crawler configuration.
   * @return a crawler configuration
   */
  public static CrawlerConfiguration read(Reader reader) {
    // This is here to get rid of the unused variable warning.
    Objects.requireNonNull(reader);
    // TODO: Fill in this method

    ObjectMapper mapper = new ObjectMapper();
    mapper.disable(Feature.AUTO_CLOSE_SOURCE);
    try {
      CrawlerConfiguration crawlerConfiguration = mapper.readValue(
          reader, CrawlerConfiguration.class
      );

      return crawlerConfiguration;
    } catch (IOException ex) {
      /*
        I am wrapping the exception to avoid adding throws clause to method because the
        clause was not added as part of the boilerplate code given to me for the assignment.
      */
      throw new RuntimeException(ex);
    }
  }
}
