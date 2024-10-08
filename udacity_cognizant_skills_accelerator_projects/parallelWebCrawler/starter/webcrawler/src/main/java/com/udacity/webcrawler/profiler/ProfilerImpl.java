package com.udacity.webcrawler.profiler;

import java.io.BufferedWriter;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;
import javax.inject.Inject;
import java.io.IOException;
import java.io.Writer;
import java.nio.file.Path;
import java.time.Clock;
import java.time.ZonedDateTime;
import java.util.Objects;

import static java.time.format.DateTimeFormatter.RFC_1123_DATE_TIME;

/**
 * Concrete implementation of the {@link Profiler}.
 */
final class ProfilerImpl implements Profiler {

  private final Clock clock;
  private final ProfilingState state = new ProfilingState();
  private final ZonedDateTime startTime;

  @Inject
  ProfilerImpl(Clock clock) {
    this.clock = Objects.requireNonNull(clock);
    this.startTime = ZonedDateTime.now(clock);
  }

  @Override
  public <T> T wrap(Class<T> klass, T delegate) {
    Objects.requireNonNull(klass);

    boolean isAnyMethodAnnotatedWithProfiled = false;

    for (Method method : klass.getDeclaredMethods()) {
      isAnyMethodAnnotatedWithProfiled = method.getAnnotation(Profiled.class) != null;

      if (isAnyMethodAnnotatedWithProfiled) break;
    }

    if (!isAnyMethodAnnotatedWithProfiled) {
      throw new IllegalArgumentException(
          "No method for the delegate argument was annotated with the @Profiled annotation."
      );
    }



    // TODO: Use a dynamic proxy (java.lang.reflect.Proxy) to "wrap" the delegate in a
    //       ProfilingMethodInterceptor and return a dynamic proxy from this method.
    //       See https://docs.oracle.com/javase/10/docs/api/java/lang/reflect/Proxy.html.
    Object proxy = Proxy.newProxyInstance(
        klass.getClassLoader(),
        new Class<?>[] {klass},
        new ProfilingMethodInterceptor(clock, state, delegate)
    );

    return (T) proxy;
  }

  @Override
  public void writeData(Path path) {
    // TODO: Write the ProfilingState data to the given file path. If a file already exists at that
    //       path, the new data should be appended to the existing file.

    try (BufferedWriter writer = Files.newBufferedWriter(
      path,
      StandardCharsets.UTF_8,
      StandardOpenOption.CREATE, StandardOpenOption.WRITE, StandardOpenOption.APPEND
    )) {
      writeData(writer);
    } catch(IOException ex) {
      /*
        I am wrapping the exception to avoid adding throws clause to method because the
        clause was not added as part of the boilerplate code given to me for the assignment.
      */
      throw new RuntimeException(ex);
    }
  }

  @Override
  public void writeData(Writer writer) throws IOException {
    writer.write("Run at " + RFC_1123_DATE_TIME.format(startTime));
    writer.write(System.lineSeparator());
    state.write(writer);
    writer.write(System.lineSeparator());
  }
}
