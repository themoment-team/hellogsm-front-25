/**
 * react-hooks v7이 도입한 React Compiler 진단 룰들.
 *
 * Stage 2(flat config 전환)에서 전환과 코드 수정을 격리하기 위해 전부 warn으로
 * 강등했다가, Stage 4에서 위반 0건 룰 11종을 error 승격, Stage 5에서 위반 코드
 * 수정(watch→useWatch·getValues, 파생 상태 전환, 컴포넌트 호이스팅) 후 잔여
 * 3종도 error 승격해 14종 전부 error가 됐다. 정당한 예외(외부 저장소 마운트
 * 복원 등)는 해당 지점에 eslint-disable + 사유 주석으로 관리한다.
 * rules-of-hooks(error)/exhaustive-deps(warn)는 v4 시절과 동일 심각도 유지.
 */
export const reactHooksCompilerRules = {
  'react-hooks/static-components': 'error',
  'react-hooks/use-memo': 'error',
  'react-hooks/preserve-manual-memoization': 'error',
  'react-hooks/incompatible-library': 'error',
  'react-hooks/immutability': 'error',
  'react-hooks/globals': 'error',
  'react-hooks/refs': 'error',
  'react-hooks/set-state-in-effect': 'error',
  'react-hooks/error-boundaries': 'error',
  'react-hooks/purity': 'error',
  'react-hooks/set-state-in-render': 'error',
  'react-hooks/unsupported-syntax': 'error',
  'react-hooks/config': 'error',
  'react-hooks/gating': 'error',
};

/**
 * react-hooks/incompatible-library가 못 잡는 구멍을 메우는 보완 룰.
 *
 * 저 룰은 `useForm().watch` 형태를 어휘적으로만 탐지해서, watch를 props로 자식에
 * 내려주면 탐지되지 않는다. 그 경로로 남아 있던 Step1~4·하위 폼 8개 컴포넌트에서
 * 컴파일러가 watch() 호출 결과와 그것을 쓰는 JSX 스코프를 통째로 메모이즈해
 * 라디오·셀렉트 선택이 화면에 반영되지 않는 버그가 났다(2026-07-27).
 *
 * watch는 렌더마다 다른 값을 반환하는 비순수 함수이므로 props 경계를 넘겨선 안 된다.
 * control을 넘기고 자식에서 useWatch로 구독하는 것이 RHF 권장 방식이다.
 */
export const rhfWatchPropRules = {
  'no-restricted-syntax': [
    'error',
    {
      selector:
        'TSPropertySignature TSTypeReference > Identifier[name="UseFormWatch"]',
      message:
        'watch를 props로 넘기지 마세요. React Compiler가 비순수 함수인 watch()의 호출 결과를 메모이즈해 값이 갱신되지 않습니다. control을 넘기고 자식에서 useWatch({ control, name })로 구독하거나, 구독이 불필요하면 getValues()를 쓰세요.',
    },
  ],
};
