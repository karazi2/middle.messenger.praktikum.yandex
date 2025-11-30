export class Nav {
	render(): string {
		return `
      <nav class="nav">
        <button data-page="signIn">Sign In</button>
        <button data-page="registration">Registration</button>

        <button data-page="chat">Chat</button>

        <button data-page="profile">Profile</button>
        <button data-page="profileEdit">Profile Edit</button>
        <button data-page="passwordEdit">Password Edit</button>

        <button data-page="404">404</button>
        <button data-page="500">5xx</button>
      </nav>
    `
	}
}
