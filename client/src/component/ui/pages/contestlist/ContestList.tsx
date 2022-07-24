import "./contestlist.scss"

export default function ContestList(props: {title: string; active: any; setSelected: any; id: string}) {
  return (
    <li className={props.active ? "contestlist active" : "contestlist"}
        onClick={()=>props.setSelected(props.id)}>
        {props.title}
    </li>
  )
}
