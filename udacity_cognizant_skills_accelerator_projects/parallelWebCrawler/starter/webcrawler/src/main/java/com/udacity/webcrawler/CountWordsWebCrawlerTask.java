package com.udacity.webcrawler;

import com.udacity.webcrawler.parser.PageParser;
import com.udacity.webcrawler.parser.PageParserFactory;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.RecursiveAction;
import java.util.regex.Pattern;

public class CountWordsWebCrawlerTask extends RecursiveAction {
  private final String url;
  private final int maxDepth;
  private final Clock clock;
  private final Instant deadline;
  private final List<Pattern> ignoredUrls;
  private final Set<String> visitedUrls;
  private final PageParserFactory parserFactory;
  private final ConcurrentMap<String, Integer> wordCountsMap;

  private CountWordsWebCrawlerTask(
    String url,
    int maxDepth,
    Clock clock,
    Instant deadline,
    List<Pattern> ignoredUrls,
    Set<String> visitedUrls,
    PageParserFactory parserFactory,
    ConcurrentMap<String, Integer> wordCountsMap
  ) {
    this.url = url;
    this.maxDepth = maxDepth;
    this.clock = clock;
    this.deadline = deadline;
    this.ignoredUrls = ignoredUrls;
    this.visitedUrls = visitedUrls;
    this.parserFactory = parserFactory;
    this.wordCountsMap = wordCountsMap;
  }

  /*
    For the compute method, I copied and modified the code from
    the crawlInternal method from SequentialWebCrawler.java
  */
  @Override
  protected void compute() {
    if (maxDepth == 0 || clock.instant().isAfter(deadline)) {
      return;
    }

    for (Pattern pattern : ignoredUrls) {
      if (pattern.matcher(url).matches()) {
        return;
      }
    }

    if (!visitedUrls.add(url)) { // using the Map#add method in if condition for thread safety
      return;
    }

    PageParser.Result result = parserFactory.get(url).parse();
    for (Entry<String, Integer> e : result.getWordCounts().entrySet()) {
      final String word = e.getKey();
      final int count = e.getValue();
      // using the ConcurrentMap#compute method for thread safety
      wordCountsMap.compute(word, (k, v) -> v == null ? count : v + count);
    }

    final List<CountWordsWebCrawlerTask> tasks = new ArrayList<>();

    for (String link : result.getLinks()) {
      tasks.add(
        new CountWordsWebCrawlerTaskBuilder()
          .setUrl(link)
          .setMaxDepth(maxDepth - 1)
          .setClock(clock)
          .setDeadline(deadline)
          .setIgnoredUrls(ignoredUrls)
          .setVisitedUrls(visitedUrls)
          .setParserFactory(parserFactory)
          .setWordCountsMap(wordCountsMap)
          .build()
      );
    }

    invokeAll(tasks);
  }

  public static class CountWordsWebCrawlerTaskBuilder {
    private String url;
    private int maxDepth;
    private Clock clock;
    private Instant deadline;
    private List<Pattern> ignoredUrls;
    private Set<String> visitedUrls;
    private PageParserFactory parserFactory;
    private ConcurrentMap<String, Integer> wordCountsMap;

    public CountWordsWebCrawlerTaskBuilder setUrl(String url) {
      this.url = url;
      return this;
    }

    public CountWordsWebCrawlerTaskBuilder setMaxDepth(int maxDepth) {
      this.maxDepth = maxDepth;
      return this;
    }

    public CountWordsWebCrawlerTaskBuilder setClock(Clock clock) {
      this.clock = clock;
      return this;
    }

    public CountWordsWebCrawlerTaskBuilder setDeadline(Instant deadline) {
      this.deadline = deadline;
      return this;
    }

    public CountWordsWebCrawlerTaskBuilder setIgnoredUrls(
        List<Pattern> ignoredUrls) {
      this.ignoredUrls = ignoredUrls;
      return this;
    }

    public CountWordsWebCrawlerTaskBuilder setVisitedUrls(Set<String> visitedUrls) {
      this.visitedUrls = visitedUrls;
      return this;
    }

    public CountWordsWebCrawlerTaskBuilder setParserFactory(
        PageParserFactory parserFactory) {
      this.parserFactory = parserFactory;
      return this;
    }

    public CountWordsWebCrawlerTaskBuilder setWordCountsMap(
        ConcurrentMap<String, Integer> wordCountsMap) {
      this.wordCountsMap = wordCountsMap;
      return this;
    }

    public CountWordsWebCrawlerTask build() {
      Objects.requireNonNull(url);
      Objects.requireNonNull(clock);
      Objects.requireNonNull(deadline);
      Objects.requireNonNull(ignoredUrls);
      Objects.requireNonNull(visitedUrls);
      Objects.requireNonNull(parserFactory);
      Objects.requireNonNull(wordCountsMap);

      return new CountWordsWebCrawlerTask(
        url, maxDepth, clock, deadline, ignoredUrls, visitedUrls, parserFactory, wordCountsMap
      );
    }
  }
}
