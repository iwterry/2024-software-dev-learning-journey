package com.udacity.webcrawler.profiler;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.Clock;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A method interceptor that checks whether {@link Method}s are annotated with the {@link Profiled}
 * annotation. If they are, the method interceptor records how long the method invocation took.
 */
final class ProfilingMethodInterceptor implements InvocationHandler {

  private final Clock clock;
  private final ProfilingState state;
  private final Object delegate;

  // TODO: You will need to add more instance fields and constructor arguments to this class.
  ProfilingMethodInterceptor(Clock clock, ProfilingState state, Object delegate) {
    this.clock = Objects.requireNonNull(clock);
    this.state = state;
    this.delegate = delegate;
  }

  @Override
  public Object invoke(Object proxy, Method method, Object[] args)
      throws Throwable {
    // TODO: This method interceptor should inspect the called method to see if it is a profiled
    //       method. For profiled methods, the interceptor should record the start time, then
    //       invoke the method using the object that is being profiled. Finally, for profiled
    //       methods, the interceptor should record how long the method call took, using the
    //       ProfilingState methods.
    if (method.getAnnotation(Profiled.class) == null) {
      try {
        return method.invoke(delegate, args);
      } catch (InvocationTargetException ex) {
        throw ex.getCause();
      }
    }

    final ZonedDateTime startTime = ZonedDateTime.now(clock);

    try {
      return method.invoke(delegate, args);
    } catch (InvocationTargetException ex) {
      throw ex.getCause();
    } finally {
      final ZonedDateTime endTime = ZonedDateTime.now(clock);
      final Duration duration = Duration.between(startTime, endTime);
      state.record(delegate.getClass(), method, duration);
    }
  }
}
