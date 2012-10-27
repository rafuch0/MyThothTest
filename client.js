var socket = io.connect("http://thoth.example.com:8083");
var userList = new Array();
var serverListData = new Array();
var serverListText = new Array();

socket.on("message", recieveMessage);
setInterval(updatePage, 3000);

function recieveMessage(data)
{
	var response = "";
	if(data.type === "serverList")
	{
		serverListData.push({type: "thothData", message: data.message});
	}

	updateData();
}

function updateData()
{
	serverListText = [];

	var listData;

	if(serverListData)
	for (var i=0; i < serverListData.length; i++)
	{
		listData = serverListData[i];

		if(listData.type === "serverList")
		{
			servers = listData.message;

			var str = "";
			serverListText.push(str);
		}
	}

	serverListData = [];
}

function updatePage()
{
	var element;
	var serverListAreaData = "";

	if(serverListText)
	for (var i = 0; i < serverListText.length; i++)
	{
		serverListAreaData += serverListText[i];
	}

	if(serverListAreaData != "")
	{
		element = document.getElementById("serverListArea");
		element.innerHTML = serverListAreaData;
	}
}
