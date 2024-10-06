package com.udacity.webcrawler;

import com.udacity.webcrawler.CountWordsWebCrawlerTask.CountWordsWebCrawlerTaskBuilder;
import com.udacity.webcrawler.json.CrawlResult;

import com.udacity.webcrawler.parser.PageParserFactory;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ForkJoinTask;
import java.util.regex.Pattern;
import javax.inject.Inject;
import javax.inject.Provider;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentSkipListSet;
import java.util.concurrent.ForkJoinPool;
import java.util.stream.Collectors;

/**
 * A concrete implementation of {@link WebCrawler} that runs multiple threads on a
 * {@link ForkJoinPool} to fetch and process multiple web pages in parallel.
 */
final class ParallelWebCrawler implements WebCrawler {
  private final Clock clock;
  private final Duration timeout;
  private final int popularWordCount;
  private final ForkJoinPool pool;
  private final PageParserFactory parserFactory;
  private final int maxDepth;
  private final List<Pattern> ignoredUrls;

  @Inject
  ParallelWebCrawler(
      Clock clock,
      PageParserFactory  parserFactory,
      @Timeout Duration timeout,
      @PopularWordCount int popularWordCount,
      @MaxDepth int maxDepth,
      @IgnoredUrls List<Pattern> ignoredUrls,
      @TargetParallelism int threadCount
  ) {
    this.clock = clock;
    this.parserFactory = parserFactory;
    this.timeout = timeout;
    this.popularWordCount = popularWordCount;
    this.pool = new ForkJoinPool(Math.min(threadCount, getMaxParallelism()));
    this.maxDepth = maxDepth;
    this.ignoredUrls = ignoredUrls;
  }

  @Override
  public CrawlResult crawl(List<String> startingUrls) {
    Instant deadline = clock.instant().plus(timeout);
    ConcurrentMap<String, Integer> counts = new ConcurrentHashMap<>();
    Set<String> visitedUrls = new HashSet<>();

    final List<CountWordsWebCrawlerTask> tasks = new ArrayList<>(startingUrls.size());

    for (String url : startingUrls) {
      tasks.add(
        new CountWordsWebCrawlerTaskBuilder()
          .setUrl(url)
          .setClock(clock)
          .setMaxDepth(maxDepth)
          .setDeadline(deadline)
          .setIgnoredUrls(ignoredUrls)
          .setVisitedUrls(visitedUrls)
          .setParserFactory(parserFactory)
          .setWordCountsMap(counts)
          .build()
      );
    }

    for (CountWordsWebCrawlerTask task : tasks) {
      pool.execute(task);
    }

    for (CountWordsWebCrawlerTask task : tasks) {
      task.join();
    }

    // I copied the below code in this method from SequentialWebCrawler.java
    if (counts.isEmpty()) {
      return new CrawlResult.Builder()
          .setWordCounts(counts)
          .setUrlsVisited(visitedUrls.size())
          .build();
    }

    return new CrawlResult.Builder()
        .setWordCounts(WordCounts.sort(counts, popularWordCount))
        .setUrlsVisited(visitedUrls.size())
        .build();
  }

  @Override
  public int getMaxParallelism() {
    return Runtime.getRuntime().availableProcessors();
  }
}
