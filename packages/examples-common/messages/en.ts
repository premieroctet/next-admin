export default {
  admin: {
    actions: {
      post: {
        publish: {
          title: "Publish post",
          success: "Post published successfully",
        },
        "add-tag": {
          title: "Add tag",
          success: "Tag added successfully",
        },
      },
      user: {
        email: {
          title: "Send email",
          success: "Email sent successfully",
          error: "Error while sending email",
        },
        details: {
          title: "User details",
        },
      },
    },
    form: {
      user: {
        email: {
          error: "Invalid email",
        },
      },
    },
  },
};
