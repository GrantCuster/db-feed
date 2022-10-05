import { useS3Upload } from "next-s3-upload";
import Link from "next/link";
import { useState } from "react";

function Admin() {
  let { uploadToS3 } = useS3Upload();
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="max-w-[520px] mx-auto my-6">
      <div>
        <Link href="/">
          <a className="underline">Feed</a>
        </Link>
      </div>
      <div className={`${submitting ? "block" : "hidden"}`}>submitting...</div>
      <div className={`${submitting ? "hidden" : "block"}`}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            // setSubmitting(true);

            const passwordCheck = await fetch("/api/checkPassword", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                // @ts-ignore
                password: e.target.elements.password.value,
              }),
            });
            if (passwordCheck.status !== 200) {
              alert("incorrect password");
              setSubmitting(false);
              return;
            }

            // @ts-ignore
            const imageFile = e.target.elements.image.files[0];
            const { url } = await uploadToS3(imageFile);
            // const url = "test";

            const body = new FormData();
            body.append("file", imageFile);

            let newPost = {
              // @ts-ignore
              feed_type: e.target.elements.type.value,
              image: url,
              // @ts-ignore
              text: e.target.elements.text.value,
            };
            // @ts-ignore
            if (e.target.elements.from.value.length > 0) {
              // @ts-ignore
              newPost.from = e.target.elements.from.value;
            }
            // @ts-ignore
            if (e.target.elements.via.value.length > 0) {
              // @ts-ignore
              newPost.via = e.target.elements.via.value;
            }

            body.append("newPost", JSON.stringify(newPost));

            const createdPost = await fetch("/api/createPost", {
              method: "POST",
              body,
            }).then((res) => res.json());

            body.append("postId", createdPost.id.toString());

            // @ts-ignore
            if (e.target.elements.tweet.checked) {
              await fetch("/api/tweet", {
                method: "POST",
                body,
              });
            }
          }}
        >
          <div>Password</div>
          <div>
            <input type="password" name="password" required />
          </div>
          <div>Type</div>
          <div>
            <label>
              <input type="radio" name="type" value="work" defaultChecked />{" "}
              Work
            </label>
          </div>
          <div>
            <label>
              <input type="radio" name="type" value="inspiration" /> Inspiration
            </label>
          </div>
          <div>Image</div>
          <div>
            <input type="file" name="image" required />
          </div>
          <div>Text</div>
          <div>
            <textarea name="text" />
          </div>
          <div>From</div>
          <div>
            <input type="text" name="from" />
          </div>
          <div>Via</div>
          <div>
            <input type="text" name="via" />
          </div>
          <div>Social</div>
          <div>
            <label>
              <input type="checkbox" name="tweet" defaultChecked /> Tweet
            </label>
          </div>
          <div>
            <input
              type="submit"
              value="Post"
              className="px-4 py-2 bg-blue-200 rounded-md cursor-pointer hover:bg-blue-300"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Admin;
