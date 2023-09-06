import { useState } from "react";

const initialFriends = [
	{
		id: 118836,
		name: "Clark",
		image: "https://i.pravatar.cc/48?u=118836",
		balance: -7,
	},
	{
		id: 933372,
		name: "Sarah",
		image: "https://i.pravatar.cc/48?u=933372",
		balance: 20,
	},
	{
		id: 499476,
		name: "Anthony",
		image: "https://i.pravatar.cc/48?u=499476",
		balance: 0,
	},
];

const App = () => {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [friends, setFriends] = useState(initialFriends);
	const [selectedFriend, setSelectedFriend] = useState(null);

	function toggleForm() {
		setIsFormOpen(!isFormOpen);
	}

	function updateFriends(newFriend) {
		setIsFormOpen(false);
		setFriends((prevFriends) => [...prevFriends, newFriend]);
	}

	function handleSelection(friend) {
		setSelectedFriend((curr) => {
			return curr?.id === friend.id ? null : friend;
		});
		setIsFormOpen(false);
	}

	function handleSplitBill(value) {
		setFriends((friends) =>
			friends.map((friend) =>
				friend.id === selectedFriend.id
					? { ...friend, balance: friend.balance + value }
					: friend
			)
		);
		setSelectedFriend(null);
	}

	return (
		<div className="app">
			<div className="sidebar">
				<FriendsList
					friends={friends}
					selectedFriend={selectedFriend}
					handleSelection={handleSelection}
				/>
				{isFormOpen && <FormAddFriend updateFriends={updateFriends} />}
				<Button onClick={toggleForm}>
					{isFormOpen ? "Close" : "Add Friends"}
				</Button>
			</div>
			{selectedFriend && !isFormOpen && (
				<FormSplitBill
					friend={selectedFriend}
					handleSplitBill={handleSplitBill}
				/>
			)}
		</div>
	);
};

export default App;

function FriendsList({ friends, selectedFriend, handleSelection }) {
	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					friend={friend}
					key={friend.id}
					handleSelection={handleSelection}
					selectedFriend={selectedFriend}
				/>
			))}
		</ul>
	);
}

function Friend({ friend, selectedFriend, handleSelection }) {
	const isSelected = friend.id === selectedFriend?.id;

	return (
		<li className={isSelected ? "selected" : ""}>
			<img src={friend.image} alt={friend.name} />
			<h3>{friend.name}</h3>
			{friend.balance < 0 && (
				<p className="red">You owe ${Math.abs(friend.balance)}</p>
			)}
			{friend.balance > 0 && (
				<p className="green">You owe ${Math.abs(friend.balance)}</p>
			)}
			{friend.balance === 0 && <p>You and {friend.name} are even</p>}
			<Button onClick={() => handleSelection(friend)}>
				{isSelected ? "Close" : "Select"}
			</Button>
		</li>
	);
}

function FormAddFriend({ updateFriends }) {
	const [name, setName] = useState("");
	const [url, setUrl] = useState("https://i.pravatar.cc/48");

	function handleSubmit(e) {
		e.preventDefault();

		const id = crypto.randomUUID();

		if (!name || !url) return;

		const newFriend = {
			id,
			name,
			image: `${url}?u=${id}` + id,
			balance: 0,
		};

		updateFriends(newFriend);

		setName("");
		setUrl("https://i.pravatar.cc/48");
	}

	return (
		<form className="form-add-friend" onSubmit={handleSubmit}>
			<label>👬Friend name</label>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<label>🌄 Image URL</label>
			<input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
			<Button>Add</Button>
		</form>
	);
}

function Button({ children, onClick }) {
	return (
		<button className="button" onClick={onClick}>
			{children}
		</button>
	);
}

function FormSplitBill({ friend, handleSplitBill }) {
	const [bill, setBill] = useState("");
	const [userExpense, setUserExpenses] = useState("");
	const paidByFriend = bill ? bill - userExpense : "";
	const [whoIsPaying, setWhoIsPaying] = useState("user");

	function handleSubmit(e) {
		e.preventDefault();
		if (!bill || !userExpense) return;
		handleSplitBill(whoIsPaying === "user" ? paidByFriend : -userExpense);
	}

	return (
		<form className="form-split-bill" onSubmit={handleSubmit}>
			<h2>Split a bill with {friend.name}</h2>
			<label>💲 Bill Value</label>
			<input
				type="text"
				value={bill}
				onChange={(e) =>
					setBill(isNaN(e.target.value) ? "" : Number(e.target.value))
				}
			/>

			<label>💰 Your expenses</label>
			<input
				type="text"
				value={userExpense}
				onChange={(e) =>
					setUserExpenses(
						isNaN(e.target.value)
							? ""
							: Number(e.target.value) > bill
							? userExpense
							: Number(e.target.value)
					)
				}
			/>

			<label>👬 {friend.name}'s expense</label>
			<input type="text" disabled value={paidByFriend} />

			<label>🤑 Who is paying the bill</label>
			<select
				value={whoIsPaying}
				onChange={(e) => setWhoIsPaying(e.target.value)}
			>
				<option value="user">You</option>
				<option value="friend">{friend.name}</option>
			</select>
			<Button>Split Bill</Button>
		</form>
	);
}
