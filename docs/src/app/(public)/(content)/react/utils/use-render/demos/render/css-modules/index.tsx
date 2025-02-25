'use client';
import * as React from 'react';
import { useRender } from '@base-ui-components/react/use-render';
import styles from './index.module.css';

type TextProps = {
  render?: useRender.RenderProp<Record<string, unknown>>;
  children: React.ReactNode;
};

function Text(props: TextProps) {
  const { render, ...otherProps } = props;

  const { renderElement } = useRender({
    render: render ?? <p />,
    props: { ...otherProps, className: styles.Text },
  });

  return renderElement();
}

export default function ExampleText() {
  return (
    <div>
      <Text>Text component rendered as a paragraph tag</Text>
      <Text render={<strong />}>Text component rendered as a strong tag</Text>
    </div>
  );
}
