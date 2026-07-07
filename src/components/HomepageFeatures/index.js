import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '简单易学',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        所有内容都用大白话编写，告别复杂难懂内容
      </>
    ),
  },
  {
    title: '重点讲解',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        讲解内容均为重点难点，彻底解决你的语法问题
      </>
    ),
  },
  {
    title: '免费 + 开源',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        任何人都可以在遵守 CC BY-NC-SA 4.0 条款的前提下分发、改编、转载。
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
