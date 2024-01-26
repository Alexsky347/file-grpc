import { Component, createRef } from "react";

function withInfiniteScroll(WrappedComponent: React.ComponentType<any>) {
    return class extends Component {
      observer: IntersectionObserver | null = null;
      lastElementRef = createRef();
  
      componentDidMount() {
        this.observer = new IntersectionObserver(entries => {
          const first = entries[0];
          if (first.isIntersecting) {
            WrappedComponent.prototype.fetchData();
          }
        });
  
        if (this.lastElementRef.current) {
          this.observer.observe(this.lastElementRef.current as Element);
        }
      }
  
      componentWillUnmount() {
        if (this.observer) {
          this.observer.disconnect();
        }
      }
  
      render() {
        return (
          <>
            <WrappedComponent {...this.props} />
            <div ref={this.lastElementRef} />
          </>
        );
      }
    };
  }
  
  export  {withInfiniteScroll};
