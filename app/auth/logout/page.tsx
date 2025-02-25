// app/auth/signout/page.tsx
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Sign Out - Deep Backrooms"
};

export default async function LogoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold">Sign Out</h1>
        <p className="text-muted-foreground">
          Are you sure you want to sign out of Deep Backrooms?
        </p>

        <form 
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button type="submit" className="w-full">
            Confirm Sign Out
          </Button>
        </form>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => redirect("/dashboard")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}