import classes from './style.module.css'
export interface FooterProps {

}

const Footer = (): JSX.Element => {
  return (
    <div className={classes.footer}>
      Developed by Akshat Garg
    </div>
  )
}

export default Footer
