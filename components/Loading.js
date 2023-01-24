export default function Loading({ children }) {
  return (
    <div class="ml-1 flex justify-center ">
      <div class="flex  rounded-full justify-center self-center">
        <div>
          <div class="rounded-full animate-pulse">{children}</div>
        </div>
        <div>
          <div class="rounded-full ml-1 animate-pulse">{children}</div>
        </div>
        <div>
          <div class="rounded-full ml-1 animate-pulse">{children}</div>
        </div>
      </div>
    </div>
  );
}
