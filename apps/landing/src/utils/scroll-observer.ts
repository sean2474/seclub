/**
 * 공유 IntersectionObserver 관리를 위한 싱글톤 클래스
 * 여러 컴포넌트에서 동일한 옵션으로 IntersectionObserver를 재사용하여 성능 최적화
 */
export class ScrollObserverManager {
  private static instance: ScrollObserverManager;
  private observers: Map<string, IntersectionObserver>;
  private elements: Map<Element, { callback: () => void, options: IntersectionObserverInit }>;

  private constructor() {
    this.observers = new Map();
    this.elements = new Map();
  }

  public static getInstance(): ScrollObserverManager {
    if (!ScrollObserverManager.instance) {
      ScrollObserverManager.instance = new ScrollObserverManager();
    }
    return ScrollObserverManager.instance;
  }

  public observe(element: Element, callback: () => void, options: IntersectionObserverInit): void {
    // 옵션의 해시를 생성하여 동일한 옵션을 가진 Observer를 재사용
    const optionsKey = JSON.stringify(options);
    
    // 요소와 콜백 저장
    this.elements.set(element, { callback, options });
    
    // 해당 옵션으로 이미 생성된 Observer가 있는지 확인
    if (!this.observers.has(optionsKey)) {
      // 새 Observer 생성
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 요소가 화면에 나타나면 콜백 실행
            const element = entry.target;
            const elementData = this.elements.get(element);
            if (elementData) {
              elementData.callback();
              // 한 번만 실행하고 관찰 중단
              this.unobserve(element);
            }
          }
        });
      }, options);
      
      this.observers.set(optionsKey, observer);
    }
    
    // 요소 관찰 시작
    const observer = this.observers.get(optionsKey)!;
    observer.observe(element);
  }

  public unobserve(element: Element): void {
    // 요소에 대한 정보 가져오기
    const elementData = this.elements.get(element);
    if (elementData) {
      // 해당 요소의 옵션에 맞는 Observer 찾기
      const optionsKey = JSON.stringify(elementData.options);
      const observer = this.observers.get(optionsKey);
      
      if (observer) {
        observer.unobserve(element);
      }
      
      // 요소 정보 삭제
      this.elements.delete(element);
    }
  }

  public disconnect(): void {
    // 모든 Observer 연결 해제
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.elements.clear();
  }
}
