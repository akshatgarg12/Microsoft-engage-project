import classes from './style.module.css'
export interface FooterProps {

}

const Footer = (): JSX.Element => {
  return (
    <div className={classes.footer}>
      Developed by <a href="mailto:akshatarungarg78@gmail.com">Akshat Garg</a> | 
      <a href="https://www.github.com/akshatgarg12" rel="noreferrer" target="_blank">Github</a> |
      <a href="https://www.linkedin.com/in/akshat-garg-ba1ab0183/" rel="noreferrer" target="_blank">LinkedIn</a>
    </div>
  )
}

export default Footer
