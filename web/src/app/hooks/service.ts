import { useEffect, useMemo, useRef, useState } from 'react';
import AuthenticationService from '../services/authentication';
import DiscussionService from '../services/discussion';
import UserLocalStorage from '../storage/user';
import toast from 'react-hot-toast';
import PostService from '../services/post';
import PostLocalStorage from '../storage/post';

type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>;
type UsePromiseReturn<T extends string[], P extends any[], R> = {
  trigger: () => Promise<void>;
  data: R | null;
  error: any;
  isLoading: boolean,
  updateError: (err: any) => void;
  updateData: (data: R | null) => void;
} & {
  [K in keyof T as `set${Capitalize<T[K] & string>}`]: (value: P[K & number]) => void;
} & {
  [K in keyof T as `set${Capitalize<T[K] & string>}State`]: (value: P[K & number]) => void;
} & {
  [K in keyof T as `${T[K] & string}State`]: P[K & number];
};
export function usePromise<T extends string[], P extends any[], R>(
  fn: AsyncFunction<P, R>,
  paramNames: T
): UsePromiseReturn<T, P, R> {
  const [err, updateErr] = useState<any>(null)
  const [data, updateData] = useState<R | null>(null)
  const paramRefs = useRef<P>(fn.length > 0 ? (new Array(fn.length).fill(null) as P) : ([] as P))
  const [paramStates, setParamStates] = useState<P>(fn.length > 0 ? (new Array(fn.length).fill(null) as P) : ([] as P))
  const [triggered, setTriggered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(false)
    if (err) {
      toast(err.toString())
      updateErr(null)
    }
  }, [err, updateErr]);

  useEffect(() => {
    setIsLoading(false)
  }, [data])

  const paramSetters = useMemo(
    () =>
      paramRefs.current.map((_, index) => (value: P[number]) => {
        paramRefs.current[index] = value;
      }),
    []
  );

  const paramStateSetters = useMemo(
    () =>
      paramStates.map((_, index) => (value: P[number]) => {
        paramRefs.current[index] = value;
        setParamStates(prevState => {
          const newState = [...prevState] as P;
          newState[index] = value;
          return newState;
        });
      }),
    [paramStates]
  );

  const trigger = useMemo(() => {
      return (async () => {
        if (triggered) return

        try {
          setIsLoading(true)
          const result = await fn(...paramRefs.current)
          updateData(result)
        } catch (error) {
          console.log('error happen')
          updateErr(error)
        }
        finally {
          setTriggered(false)
        }
      })
  }, [triggered, setTriggered, setIsLoading, updateData, updateErr])

  const setters = paramSetters.reduce((acc, setter, index) => {
    const paramName = `set${capitalize(paramNames[index])}`;
    acc[paramName as `set${Capitalize<typeof paramNames[number]>}`] = setter as any;
    return acc;
  }, {} as { [K in T[number] as `set${Capitalize<K>}`]: (value: P[number]) => void });

  const stateSetters = paramStateSetters.reduce((acc, setter, index) => {
    const paramName = `set${capitalize(paramNames[index])}State`;
    acc[paramName as `set${Capitalize<typeof paramNames[number]>}State`] = setter as any;
    return acc;
  }, {} as { [K in T[number] as `set${Capitalize<K>}State`]: (value: P[number]) => void });

  const states = paramStates.reduce((acc, state, index) => {
    const paramName = `${paramNames[index]}State`;
    acc[paramName as `${typeof paramNames[number]}State`] = state;
    return acc;
  }, {} as { [K in T[number] as `${K}State`]: P[number] });

  return {
    trigger,
    data,
    updateData,
    updateError: updateErr,
    isLoading,
    error: err,
    ...setters,
    ...stateSetters,
    ...states,
  } as UsePromiseReturn<T, P, R>;
}

function capitalize<S extends string>(str: S): Capitalize<S> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<S>;
}

const postLocalStorage = new PostLocalStorage()
const userLocalStorage = new UserLocalStorage()
const discussionService = new DiscussionService()
const authService = new AuthenticationService(userLocalStorage)
const postService = new PostService(postLocalStorage)

export function useService() {
  return {
    post: () => {
      return {
        like: () => usePromise(postService.like.bind(postService), ['postTitle', 'count']),
        vote: () => usePromise(postService.vote.bind(postService), ['postTitle']),
        view: () => usePromise(postService.view.bind(postService), ['postTitle']),
        get: () => usePromise(postService.get.bind(postService), ['title']),
        isVoted: () => usePromise(postLocalStorage.isVoted.bind(postLocalStorage), ['postTitle'])
      }
    },
    discussion: () => {
      return {
        newDiscussion: () => usePromise(discussionService.newDiscussion.bind(discussionService), ['content', 'title']),
        getDiscussions: () => usePromise(discussionService.getDiscussions.bind(discussionService), ['page'])
      };
    },
    auth: () => {
      return {
        signupByEmail: () => usePromise(authService.signupByEmail.bind(authService), ['email', 'password']),
        signinByEmail: () => usePromise(authService.signin.bind(authService), ['email', 'password']),
        fullySignup: () => usePromise(authService.signupFullAccount.bind(authService), ['displayName', 'email', 'password']),
      };
    },
  };
}
