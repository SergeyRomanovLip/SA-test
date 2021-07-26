export const reducer = (state, action) => {
  console.log(action)
  switch (action[0]) {
    case 'CHOOSE-USER':
      return { ...state, user: { fio: action[1].fio, position: action[1].position } }
    default:
      return state
  }
}
