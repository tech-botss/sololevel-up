-- Create a function to accept friend requests that bypasses RLS
CREATE OR REPLACE FUNCTION public.accept_friend_request(request_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  req_from_user_id uuid;
  req_to_user_id uuid;
BEGIN
  -- Get the friend request details and verify it belongs to current user
  SELECT from_user_id, to_user_id INTO req_from_user_id, req_to_user_id
  FROM friend_requests
  WHERE id = request_id AND to_user_id = auth.uid();
  
  -- If no matching request found, return false
  IF req_from_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Insert both friendship directions
  INSERT INTO friends (user_id, friend_id)
  VALUES (req_to_user_id, req_from_user_id), (req_from_user_id, req_to_user_id)
  ON CONFLICT DO NOTHING;
  
  -- Delete the friend request
  DELETE FROM friend_requests WHERE id = request_id;
  
  RETURN true;
END;
$$;